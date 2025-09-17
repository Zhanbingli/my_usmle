const { getAgentOrchestrator } = require('../lib/agent');
const { AgentError, BadRequestError, ProviderNotConfiguredError } = require('../lib/agent/errors');
const { formatAgentResponse } = require('../lib/agent/responseFormatter');

const orchestrator = getAgentOrchestrator();

const GEMINI_OFFLINE_MESSAGE = `【模拟Agent总结】\n- 建议首先检索 PubMed 获取近三年的系统综述\n- 对比同主题的多篇研究，提炼一致结论\n- 若为病例问题，明确关键线索后再做鉴别诊断\n\n此为离线模式，配置 GEMINI_API_KEY 可启用真实多步推理与工具调用。`;

function normalizeProvider(input) {
  return String(input || 'gemini').trim().toLowerCase();
}

exports.act = async (req, res) => {
  try {
    const { goal, context = '', mode = 'auto', provider = 'gemini', model } = req.body || {};
    const data = await orchestrator.run({ goal, context, mode, provider, model }, { user: req.user });
    return res.json({ success: true, data });
  } catch (error) {
    const requestedProvider = normalizeProvider(req.body?.provider);

    if (error instanceof ProviderNotConfiguredError && requestedProvider === 'gemini') {
      const offlineData = formatAgentResponse({
        answer: GEMINI_OFFLINE_MESSAGE,
        meta: {
          provider: 'gemini',
          mode: req.body?.mode || 'auto',
          offline: true,
        },
      });
      return res.json({ success: true, data: offlineData, offline: true });
    }

    if (error instanceof AgentError) {
      const status = error instanceof BadRequestError ? error.statusCode : error.statusCode || 500;
      return res.status(status).json({
        success: false,
        error: error.message,
        code: error.code,
        details: error.details,
      });
    }

    console.error('Agent error:', error);
    return res.status(500).json({
      success: false,
      error: '代理执行失败',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
