const axios = require('axios');
const BaseProvider = require('./baseProvider');
const { buildStructuredAnswerPrompt } = require('../prompts');
const { formatAgentResponse } = require('../responseFormatter');
const { ProviderRequestError } = require('../errors');

class ClaudeProvider extends BaseProvider {
  async run({ goal, context, mode, model, timeout }) {
    const apiKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;
    this.ensureConfigured(apiKey);
    const selectedModel = this.resolveModel(model);
    const start = Date.now();

    const body = {
      model: selectedModel,
      max_tokens: 1200,
      temperature: 0.3,
      system: '你是一名合规的医学情报分析师，回答需要结构化且引用可靠来源。',
      messages: [
        {
          role: 'user',
          content: buildStructuredAnswerPrompt({ goal, context, mode }),
        },
      ],
    };

    try {
      const response = await axios.post('https://api.anthropic.com/v1/messages', body, {
        timeout: timeout || this.timeout,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
      });

      const text = response.data?.content?.[0]?.text?.trim();
      const usage = response.data?.usage || null;
      const durationMs = Date.now() - start;

      return formatAgentResponse({
        answer: text,
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
      throw new ProviderRequestError(this.label, 'Claude 响应失败', { detail });
    }
  }
}

module.exports = ClaudeProvider;
