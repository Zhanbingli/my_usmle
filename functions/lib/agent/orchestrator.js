const { DEFAULT_AGENT_OPTIONS, PROVIDER_DEFINITIONS } = require('./constants');
const { AgentError, BadRequestError } = require('./errors');
const GeminiProvider = require('./providers/geminiProvider');
const OpenAIProvider = require('./providers/openaiProvider');
const ClaudeProvider = require('./providers/claudeProvider');

const PROVIDER_CLASS_MAP = {
  gemini: GeminiProvider,
  openai: OpenAIProvider,
  claude: ClaudeProvider,
};

function normalizeProviderId(provider) {
  return String(provider || '').trim().toLowerCase();
}

function ensureMaxSteps(value) {
  const intValue = Number.parseInt(value, 10);
  if (Number.isFinite(intValue) && intValue > 0 && intValue <= 10) {
    return intValue;
  }
  return 3;
}

class AgentOrchestrator {
  constructor({ toolRegistry, options = {} } = {}) {
    if (!toolRegistry) {
      throw new Error('toolRegistry is required to construct AgentOrchestrator');
    }
    this.toolRegistry = toolRegistry;
    const mergedOptions = {
      ...DEFAULT_AGENT_OPTIONS,
      ...options,
    };
    this.config = {
      maxSteps: ensureMaxSteps(mergedOptions.maxSteps),
      timeout: mergedOptions.requestTimeout || 30000,
    };
    this.providers = this.instantiateProviders();
  }

  instantiateProviders() {
    const providers = {};
    for (const [key, definition] of Object.entries(PROVIDER_DEFINITIONS)) {
      const ProviderClass = PROVIDER_CLASS_MAP[key];
      if (!ProviderClass) continue;
      providers[key] = new ProviderClass({
        id: definition.id,
        label: definition.label,
        defaultModel: definition.defaultModel,
        supportsTools: definition.supportsTools,
        timeout: this.config.timeout,
      });
    }
    return providers;
  }

  getProvider(name) {
    const normalized = normalizeProviderId(name) || 'gemini';
    const provider = this.providers[normalized];
    if (!provider) {
      throw new BadRequestError(`未知的 provider: ${name}`);
    }
    return provider;
  }

  async run({ goal, context, mode = 'auto', provider = 'gemini', model }, runtimeContext = {}) {
    if (!goal || typeof goal !== 'string' || goal.trim().length === 0) {
      throw new BadRequestError('请提供有效的 goal');
    }

    const trimmedGoal = goal.trim();
    const providerInstance = this.getProvider(provider);

    try {
      const response = await providerInstance.run({
        goal: trimmedGoal,
        context,
        mode,
        model,
        toolRegistry: providerInstance.supportsTools ? this.toolRegistry : null,
        maxSteps: providerInstance.supportsTools ? this.config.maxSteps : 0,
        timeout: this.config.timeout,
        user: runtimeContext.user,
      });
      return response;
    } catch (error) {
      if (error instanceof AgentError) {
        throw error;
      }
      throw new AgentError('Agent 执行失败', { details: { provider: providerInstance.id, message: error.message } });
    }
  }
}

module.exports = AgentOrchestrator;
