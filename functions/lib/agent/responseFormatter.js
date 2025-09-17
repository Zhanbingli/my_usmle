const { DISCLAIMER } = require('./constants');

function buildActionLogEntry({ index, tool, args, result }) {
  return {
    step: index + 1,
    tool,
    args,
    status: result?.statusCode ?? 500,
    ok: result?.success !== false,
    output: result?.data || result?.error || null,
  };
}

function normalizeCitations(entries) {
  if (!Array.isArray(entries)) return [];
  return entries
    .filter((item) => item && (item.pmid || item.title))
    .map((item) => ({
      pmid: String(item.pmid || '').trim(),
      title: item.title || '',
      url: item.url || '',
    }));
}

function formatAgentResponse({ answer, actions = [], citations = [], meta = {} }) {
  const safeAnswer = (answer || '（未能生成答案，请稍后重试）') + DISCLAIMER;
  const normalizedActions = actions.map((entry, index) =>
    buildActionLogEntry({
      index,
      tool: entry.tool || 'unknown',
      args: entry.args || {},
      result: entry.result || entry,
    })
  );

  const sanitizedMeta = {
    durationMs: meta.durationMs ?? null,
    provider: meta.provider || null,
    model: meta.model || null,
    mode: meta.mode || null,
    usage: meta.usage || null,
    offline: meta.offline || false,
  };

  return {
    answer: safeAnswer,
    steps: normalizedActions.length,
    actions: normalizedActions,
    citations: normalizeCitations(citations),
    meta: sanitizedMeta,
  };
}

module.exports = {
  formatAgentResponse,
};
