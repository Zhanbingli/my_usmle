const { ProviderNotConfiguredError } = require('../errors');

class BaseProvider {
  constructor({ id, label, defaultModel, supportsTools = false, timeout = 30000 }) {
    this.id = id;
    this.label = label;
    this.defaultModel = defaultModel;
    this.supportsTools = supportsTools;
    this.timeout = timeout;
  }

  resolveModel(requestedModel) {
    return requestedModel || this.defaultModel;
  }

  ensureConfigured(value) {
    if (!value) {
      throw new ProviderNotConfiguredError(this.label || this.id);
    }
  }

  async run() { // eslint-disable-line class-methods-use-this
    throw new Error('run() must be implemented by provider');
  }
}

module.exports = BaseProvider;
