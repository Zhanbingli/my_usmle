// Shared agent tools and executors
const pubmedController = require('../controllers/pubmedController');
const caseController = require('../controllers/caseController');

// Helper: call an express-style controller and capture its JSON
function callController(controllerFn, { method = 'GET', path = '/', body = {}, query = {}, headers = {}, user = null, params = {} } = {}) {
  return new Promise((resolve) => {
    const req = { method, path, body, query, headers, user, params };
    const res = {
      status(code) { this.statusCode = code; return this; },
      json(payload) { resolve({ statusCode: this.statusCode || 200, ...payload }); },
    };
    try { controllerFn(req, res); } catch (e) {
      resolve({ statusCode: 500, success: false, error: e.message || 'controller error' });
    }
  });
}

// Tool declarations for Gemini function-calling
const toolDeclarations = [
  {
    name: 'pubmed.search',
    description: 'Search PubMed articles with optional filters',
    parameters: {
      type: 'OBJECT',
      properties: {
        query: { type: 'STRING' },
        journal: { type: 'STRING' },
        author: { type: 'STRING' },
        startDate: { type: 'STRING' },
        endDate: { type: 'STRING' },
        sortBy: { type: 'STRING', description: 'relevance|date|citations' }
      },
      required: ['query']
    }
  },
  {
    name: 'pubmed.get_article',
    description: 'Get details of a PubMed article by PMID',
    parameters: {
      type: 'OBJECT',
      properties: { pmid: { type: 'STRING' } },
      required: ['pmid']
    }
  },
  {
    name: 'cases.get',
    description: 'Get a medical training case by id',
    parameters: {
      type: 'OBJECT',
      properties: { id: { type: 'STRING' }, includeAnswer: { type: 'BOOLEAN' } },
      required: ['id']
    }
  },
  {
    name: 'cases.diagnose',
    description: 'Submit a diagnosis for a case and receive feedback (requires auth)',
    parameters: {
      type: 'OBJECT',
      properties: { id: { type: 'STRING' }, diagnosis: { type: 'STRING' } },
      required: ['id', 'diagnosis']
    }
  }
];

async function runToolByName(name, args, reqUser) {
  switch (name) {
    case 'pubmed.search': {
      return await callController(pubmedController.searchPubMed, {
        method: 'GET', path: '/api/pubmed/search', query: { ...args }
      });
    }
    case 'pubmed.get_article': {
      const pmid = args.pmid;
      return await callController(pubmedController.getArticleDetails, {
        method: 'GET', path: `/api/pubmed/articles/${pmid}`, params: { pmid }
      });
    }
    case 'cases.get': {
      const id = args.id;
      const includeAnswer = !!args.includeAnswer;
      return await callController(caseController.getCaseById, {
        method: 'GET', path: `/api/cases/${id}`, params: { id }, query: { includeAnswer: includeAnswer ? 'true' : 'false' }
      });
    }
    case 'cases.diagnose': {
      if (!reqUser) return { statusCode: 401, success: false, error: '需要认证才能提交诊断' };
      const id = args.id; const diagnosis = args.diagnosis;
      return await callController(caseController.submitDiagnosis, {
        method: 'POST', path: `/api/cases/${id}/diagnose`, params: { id }, body: { diagnosis }, user: reqUser
      });
    }
    default:
      return { statusCode: 400, success: false, error: `未知工具: ${name}` };
  }
}

module.exports = {
  toolDeclarations,
  runToolByName,
};

