class AgentError extends Error {
  constructor(message, { statusCode = 500, code = 'AGENT_ERROR', details = null } = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

class BadRequestError extends AgentError {
  constructor(message, details) {
    super(message || '请求参数无效', { statusCode: 400, code: 'BAD_REQUEST', details });
  }
}

class ProviderNotConfiguredError extends AgentError {
  constructor(provider) {
    super(`${provider} 未配置 API Key`, { statusCode: 501, code: 'PROVIDER_NOT_CONFIGURED', details: { provider } });
  }
}

class ProviderRequestError extends AgentError {
  constructor(provider, message, details) {
    super(message || `${provider} 请求失败`, { statusCode: 502, code: 'PROVIDER_REQUEST_FAILED', details: { provider, ...details } });
  }
}

module.exports = {
  AgentError,
  BadRequestError,
  ProviderNotConfiguredError,
  ProviderRequestError,
};
