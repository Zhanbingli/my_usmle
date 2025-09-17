const axios = require('axios');
const BaseProvider = require('./baseProvider');
const { buildToolDrivenPrompt } = require('../prompts');
const { formatAgentResponse } = require('../responseFormatter');
const { ProviderRequestError } = require('../errors');

function extractFunctionCall(parts) {
  if (!Array.isArray(parts)) return null;
  for (const part of parts) {
    if (part?.functionCall?.name) {
      return part.functionCall;
    }
  }
  return null;
}

function extractText(parts) {
  if (!Array.isArray(parts)) return null;
  let acc = '';
  for (const part of parts) {
    if (part?.text) acc += part.text;
  }
  return acc || null;
}

function safeParseArgs(rawArgs) {
  if (!rawArgs) return {};
  if (typeof rawArgs !== 'string') return rawArgs;
  try {
    return JSON.parse(rawArgs);
  } catch (error) {
    console.warn('Gemini Provider: 无法解析函数调用参数，返回空对象', error.message);
    return {};
  }
}

class GeminiProvider extends BaseProvider {
  constructor(options) {
    super({ supportsTools: true, ...options });
    this.apiUrl = process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta';
  }

  async generate(apiKey, model, contents, toolRegistry, timeout) {
    try {
      const url = `${this.apiUrl}/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        contents,
        tools: toolRegistry?.declarations ? [{ functionDeclarations: toolRegistry.declarations }] : undefined,
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1536,
        },
      };
      const response = await axios.post(url, payload, {
        timeout,
        headers: { 'Content-Type': 'application/json' },
      });
      const candidate = response.data?.candidates?.[0];
      return candidate?.content?.parts || [];
    } catch (error) {
      const detail = error?.response?.data || { message: error.message };
      throw new ProviderRequestError(this.label, 'Gemini 响应失败', { detail });
    }
  }

  async run({ goal, context, mode, model, toolRegistry, maxSteps, timeout, user }) {
    const apiKey = process.env.GEMINI_API_KEY;
    this.ensureConfigured(apiKey);
    if (!toolRegistry) {
      throw new Error('缺少工具注册器，无法执行 Gemini 多步推理');
    }

    const selectedModel = this.resolveModel(model);
    const stepsLimit = maxSteps && Number.isFinite(maxSteps) ? maxSteps : 3;
    const requestTimeout = timeout || this.timeout;
    const start = Date.now();

    const actions = [];
    const citations = [];
    let contents = buildToolDrivenPrompt({ goal, context, mode });
    let finalText = null;

    for (let i = 0; i < stepsLimit; i += 1) {
      const parts = await this.generate(apiKey, selectedModel, contents, toolRegistry, requestTimeout);
      const fnCall = extractFunctionCall(parts);
      if (!fnCall) {
        finalText = extractText(parts);
        break;
      }
      const argObject = safeParseArgs(fnCall.args);
      const result = await toolRegistry.invoke(fnCall.name, argObject, { user });
      actions.push({ tool: fnCall.name, args: argObject, result });
      if (fnCall.name === 'pubmed.search' && result?.success && Array.isArray(result.data)) {
        for (const entry of result.data.slice(0, 3)) {
          citations.push({
            pmid: entry.pmid,
            title: entry.title,
            url: entry.url,
          });
        }
      }
      contents.push({
        role: 'user',
        parts: [
          {
            functionResponse: {
              name: fnCall.name,
              response: result,
            },
          },
        ],
      });
    }

    if (!finalText) {
      const parts = await this.generate(apiKey, selectedModel, contents, toolRegistry, requestTimeout);
      finalText = extractText(parts);
    }

    const durationMs = Date.now() - start;

    return formatAgentResponse({
      answer: finalText,
      actions,
      citations,
      meta: {
        durationMs,
        provider: this.id,
        model: selectedModel,
        mode,
      },
    });
  }
}

module.exports = GeminiProvider;
