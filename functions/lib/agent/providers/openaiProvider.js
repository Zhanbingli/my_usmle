const axios = require('axios');
const BaseProvider = require('./baseProvider');
const { buildStructuredAnswerPrompt } = require('../prompts');
const { formatAgentResponse } = require('../responseFormatter');
const { ProviderRequestError } = require('../errors');

class OpenAIProvider extends BaseProvider {
  async run({ goal, context, mode, model, timeout }) {
    const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
    this.ensureConfigured(apiKey);
    const selectedModel = this.resolveModel(model);
    const start = Date.now();

    const body = {
      model: selectedModel,
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content: '你是一名严谨的医学信息助手，需要基于已知事实提供可靠的临床建议。',
        },
        {
          role: 'user',
          content: buildStructuredAnswerPrompt({ goal, context, mode }),
        },
      ],
    };

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', body, {
        timeout: timeout || this.timeout,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      });

      const text = response.data?.choices?.[0]?.message?.content?.trim();
      const usage = response.data?.usage || null;
      const durationMs = Date.now() - start;

      return formatAgentResponse({
        answer: text,
        actions: [],
        citations: [],
        meta: {
          durationMs,
          provider: this.id,
          model: selectedModel,
          mode,
          usage,
        },
      });
    } catch (error) {
      const detail = error?.response?.data || { message: error.message };
      throw new ProviderRequestError(this.label, 'OpenAI 响应失败', { detail });
    }
  }
}

module.exports = OpenAIProvider;
