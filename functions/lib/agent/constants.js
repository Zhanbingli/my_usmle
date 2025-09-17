const PROVIDER_DEFINITIONS = {
  gemini: {
    id: 'gemini',
    label: 'Google Gemini',
    envKey: 'GEMINI_API_KEY',
    defaultModel: 'gemini-1.5-pro',
    supportsTools: true,
  },
  openai: {
    id: 'openai',
    label: 'OpenAI',
    envKey: 'OPENAI_API_KEY',
    defaultModel: 'gpt-4o-mini',
    supportsTools: false,
  },
  claude: {
    id: 'claude',
    label: 'Anthropic Claude',
    envKey: 'CLAUDE_API_KEY',
    defaultModel: 'claude-3-5-sonnet',
    supportsTools: false,
  },
};

const DISCLAIMER = '\n\n—\n说明：本回答仅用于医学教育与信息检索，不构成诊疗建议。如有紧急或严重症状，请及时就医。';

function parseEnvInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

const DEFAULT_AGENT_OPTIONS = {
  maxSteps: parseEnvInt(process.env.AGENT_MAX_STEPS, 3),
  requestTimeout: parseEnvInt(process.env.AGENT_REQUEST_TIMEOUT, 30000),
};

module.exports = {
  DISCLAIMER,
  DEFAULT_AGENT_OPTIONS,
  PROVIDER_DEFINITIONS,
};
