const axios = require('axios');
const { toolDeclarations, runToolByName } = require('../lib/agentTools');

const DEFAULT_GEMINI_MODEL = 'gemini-1.5-pro';
const DEFAULT_OPENAI_MODEL = 'gpt-4o-mini';
const DEFAULT_CLAUDE_MODEL = 'claude-3-5-sonnet';

const GEMINI_API_URL = process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;

const DISCLAIMER = '\n\n—\n说明：本回答仅用于医学教育与信息检索，不构成诊疗建议。如有紧急或严重症状，请及时就医。';

const PROVIDER_LABEL = {
  gemini: 'Google Gemini',
  openai: 'OpenAI',
  claude: 'Anthropic Claude',
};

function buildInitialPrompt(goal, context, mode) {
  return [
    {
      role: 'user',
      parts: [
        {
          text: `你是一名医学智能代理。请遵循以下规则进行多步推理：\n- 优先使用工具(pubmed.*, cases.*)获取事实\n- 最多 3 次工具调用\n- 返回结构化结果：要点、引用(如有)、下一步建议\n\n任务: ${goal}${context ? `\n背景: ${context}` : ''}${mode ? `\n模式: ${mode}` : ''}`,
        },
      ],
    },
  ];
}

function buildAgentPrompt(goal, context, mode) {
  return `你是一名资深的医学信息分析助手，请提供清晰的结构化回答。\n任务: ${goal}${context ? `\n背景: ${context}` : ''}\n期望输出: \n1. 核心结论或诊断建议\n2. 支持依据（如存在请引用）\n3. 推荐的下一步行动\n模式: ${mode}`;
}

async function callGeminiWithTools(apiKey, modelId, contents) {
  const targetModel = modelId || DEFAULT_GEMINI_MODEL;
  const url = `${GEMINI_API_URL}/models/${targetModel}:generateContent?key=${apiKey}`;
  const body = {
    contents,
    tools: [{ functionDeclarations: toolDeclarations }],
    generationConfig: { temperature: 0.2, maxOutputTokens: 1536 },
  };
  const resp = await axios.post(url, body, {
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' },
  });
  const cand = resp.data?.candidates?.[0];
  const parts = cand?.content?.parts || [];
  return parts;
}

function extractFunctionCall(parts) {
  for (const p of parts) {
    if (p.functionCall && p.functionCall.name) return p.functionCall;
  }
  return null;
}

function extractText(parts) {
  let out = '';
  for (const p of parts) if (p.text) out += p.text;
  return out || null;
}

function wrapAnswer(answer, actions, citations) {
  const finalAnswer = (answer || '（未能生成答案，请稍后重试）') + DISCLAIMER;
  return {
    answer: finalAnswer,
    steps: Array.isArray(actions) ? actions.length : 0,
    actions: actions || [],
    citations: citations || [],
  };
}

async function runGeminiAgent({ goal, context, mode, model, user }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      offline: true,
      data: wrapAnswer(
        '【模拟Agent总结】\n- 建议首先检索 PubMed 获取近三年的系统综述\n- 对比同主题的多篇研究，提炼一致结论\n- 若为病例问题，明确关键线索后再做鉴别诊断\n\n此为离线模式，配置 GEMINI_API_KEY 可启用真实多步推理与工具调用。',
        [],
        []
      ),
    };
  }

  let contents = buildInitialPrompt(goal, context, mode);
  const MAX_STEPS = 3;
  const stepsLog = [];
  const citations = [];
  let finalText = null;

  for (let step = 0; step < MAX_STEPS; step++) {
    const parts = await callGeminiWithTools(apiKey, model, contents);
    const fn = extractFunctionCall(parts);
    if (fn) {
      const args = typeof fn.args === 'string' ? JSON.parse(fn.args || '{}') : fn.args || {};
      const result = await runToolByName(fn.name, args, user || null);
      stepsLog.push({ step: step + 1, tool: fn.name, args, status: result.statusCode, ok: result.success !== false });
      if (fn.name === 'pubmed.search' && result?.success && Array.isArray(result.data)) {
        for (const a of result.data.slice(0, 3)) {
          citations.push({ pmid: a.pmid, title: a.title, url: a.url });
        }
      }
      contents.push({
        role: 'user',
        parts: [{ functionResponse: { name: fn.name, response: result } }],
      });
      continue;
    }
    finalText = extractText(parts);
    break;
  }

  if (!finalText) {
    const parts = await callGeminiWithTools(apiKey, model, contents);
    finalText = extractText(parts);
  }

  return { data: wrapAnswer(finalText, stepsLog, citations) };
}

async function runOpenAIAgent({ goal, context, mode, model }) {
  if (!OPENAI_API_KEY) {
    return { error: { status: 501, message: 'OpenAI API Key 未配置' } };
  }

  const targetModel = model || DEFAULT_OPENAI_MODEL;
  const url = 'https://api.openai.com/v1/chat/completions';
  const prompt = buildAgentPrompt(goal, context, mode);
  const body = {
    model: targetModel,
    temperature: 0.3,
    messages: [
      { role: 'system', content: '你是一名严谨的医学信息助手，需要基于已知事实提供可靠的临床建议。' },
      { role: 'user', content: prompt },
    ],
  };

  const response = await axios.post(url, body, {
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
  });

  const text = response.data?.choices?.[0]?.message?.content?.trim();
  return { data: wrapAnswer(text, [], []) };
}

async function runClaudeAgent({ goal, context, mode, model }) {
  if (!CLAUDE_API_KEY) {
    return { error: { status: 501, message: 'Claude API Key 未配置' } };
  }

  const targetModel = model || DEFAULT_CLAUDE_MODEL;
  const url = 'https://api.anthropic.com/v1/messages';
  const prompt = buildAgentPrompt(goal, context, mode);
  const body = {
    model: targetModel,
    max_tokens: 1200,
    temperature: 0.3,
    system: '你是一名合规的医学情报分析师，回答需要结构化且引用可靠来源。',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  };

  const response = await axios.post(url, body, {
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
    },
  });

  const text = response.data?.content?.[0]?.text?.trim();
  return { data: wrapAnswer(text, [], []) };
}

function providerNotConfigured(res, provider, message) {
  return res.status(501).json({ success: false, error: message || `${PROVIDER_LABEL[provider] || provider} 未配置 API Key` });
}

exports.act = async (req, res) => {
  try {
    const { goal, context = '', mode = 'auto', provider = 'gemini', model } = req.body || {};
    if (!goal || typeof goal !== 'string') {
      return res.status(400).json({ success: false, error: '请提供有效的 goal' });
    }

    const normalizedProvider = String(provider).toLowerCase();

    let result;
    if (normalizedProvider === 'openai') {
      result = await runOpenAIAgent({ goal, context, mode, model });
    } else if (normalizedProvider === 'claude') {
      result = await runClaudeAgent({ goal, context, mode, model });
    } else {
      result = await runGeminiAgent({ goal, context, mode, model, user: req.user });
    }

    if (result?.error) {
      return providerNotConfigured(res, normalizedProvider, result.error.message);
    }

    if (result?.offline) {
      return res.json({ success: true, data: result.data });
    }

    return res.json({ success: true, data: result.data });
  } catch (error) {
    console.error('Agent error:', error.message);
    return res.status(500).json({
      success: false,
      error: '代理执行失败',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
