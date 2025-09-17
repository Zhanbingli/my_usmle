const AgentOrchestrator = require('./orchestrator');
const { createToolRegistry } = require('../agentTools');

let orchestratorInstance = null;

function getAgentOrchestrator() {
  if (!orchestratorInstance) {
    const toolRegistry = createToolRegistry();
    orchestratorInstance = new AgentOrchestrator({ toolRegistry });
  }
  return orchestratorInstance;
}

module.exports = {
  getAgentOrchestrator,
};
