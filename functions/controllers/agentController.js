const axios = require('axios');
const { toolDeclarations, runToolByName } = require('../lib/agentTools');

function buildInitialPrompt(goal, context, mode) {
  return [
    {
      role: 'user',
      parts: [
        { text: `你是一名医学智能代理。请遵循以下规则进行多步推理：\n- 优先使用工具(pubmed.*, cases.*)获取事实\n- 最多 3 次工具调用\n- 返回结构化结果：要点、引用(如有)、下一步建议\n\n任务: ${goal}${context ? `\n背景: ${context}` : ''}${mode ? `\n模式: ${mode}` : ''}`} 
      ]
    }
  ];
}

async function callGeminiWithTools(apiUrl, apiKey, contents) {
  const url = `${apiUrl}/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
  const body = {
    contents,
    tools: [{ functionDeclarations: toolDeclarations }],
    generationConfig: { temperature: 0.2, maxOutputTokens: 1536 }
  };
  const resp = await axios.post(url, body, { timeout: 30000, headers: { 'Content-Type': 'application/json' } });
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

// runToolByName imported

exports.act = async (req, res) => {
  try {
    const { goal, context = '', mode = 'auto' } = req.body || {};
    if (!goal || typeof goal !== 'string') {
      return res.status(400).json({ success: false, error: '请提供有效的 goal' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta';
    const stepsLog = [];
    const citations = [];

    // 如果没有 API Key，则走模拟代理
    if (!apiKey) {
      const mock = `【模拟Agent总结】\n- 建议首先检索 PubMed 获取近三年的系统综述\n- 对比同主题的多篇研究，提炼一致结论\n- 若为病例问题，明确关键线索后再做鉴别诊断\n\n此为离线模式，配置 GEMINI_API_KEY 可启用真实多步推理与工具调用。`;
      return res.json({ success: true, data: { answer: mock, steps: 0, actions: [] } });
    }

    let contents = buildInitialPrompt(goal, context, mode);
    const MAX_STEPS = 3;
    let finalText = null;

    for (let step = 0; step < MAX_STEPS; step++) {
      const parts = await callGeminiWithTools(apiUrl, apiKey, contents);
      const fn = extractFunctionCall(parts);
      if (fn) {
        // 执行工具
        const args = typeof fn.args === 'string' ? JSON.parse(fn.args || '{}') : (fn.args || {});
        const result = await runToolByName(fn.name, args, req.user || null);
        stepsLog.push({ step: step + 1, tool: fn.name, args, status: result.statusCode, ok: result.success !== false });
        // collect citations from pubmed.search
        if (fn.name === 'pubmed.search' && result?.success && Array.isArray(result.data)) {
          for (const a of result.data.slice(0, 3)) {
            citations.push({ pmid: a.pmid, title: a.title, url: a.url });
          }
        }
        // 把工具结果反馈给模型
        contents.push({
          role: 'user',
          parts: [{ functionResponse: { name: fn.name, response: result } }]
        });
        continue;
      }
      // 没有 function call，尝试提取文本作为最终答案
      finalText = extractText(parts);
      break;
    }

    if (!finalText) {
      // 最后兜底再要一次文本答案
      const parts = await callGeminiWithTools(apiUrl, apiKey, contents);
      finalText = extractText(parts) || '（未能生成答案，请稍后重试）';
    }

    // append standard disclaimer
    const disclaimer = '\n\n—\n说明：本回答仅用于医学教育与信息检索，不构成诊疗建议。如有紧急或严重症状，请及时就医。';
    const answerOut = finalText ? (finalText + disclaimer) : disclaimer;
    return res.json({ success: true, data: { answer: answerOut, steps: stepsLog.length, actions: stepsLog, citations } });
  } catch (error) {
    console.error('Agent error:', error.message);
    return res.status(500).json({ success: false, error: '代理执行失败', detail: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};
