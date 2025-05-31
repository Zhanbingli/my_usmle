const express = require('express');
const cors = require('cors');

// 引入控制器
const geminiController = require('../functions/controllers/geminiController');
const pubmedController = require('../functions/controllers/pubmedController');
const caseController = require('../functions/controllers/caseController');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API路由
app.use('/api/gemini', createGeminiRoutes());
app.use('/api/pubmed', createPubmedRoutes());
app.use('/api/cases', createCaseRoutes());

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Medical AI Platform API is running' });
});

function createGeminiRoutes() {
  const router = express.Router();
  router.post('/query', geminiController.processMedicalQuery);
  router.post('/clinical-reasoning', geminiController.simulateClinicalReasoning);
  return router;
}

function createPubmedRoutes() {
  const router = express.Router();
  router.post('/search', pubmedController.searchPubMed);
  router.get('/articles/:pmid', pubmedController.getArticleDetails);
  return router;
}

function createCaseRoutes() {
  const router = express.Router();
  router.get('/', caseController.getAllCases);
  router.get('/:id', caseController.getCaseById);
  router.post('/:id/diagnose', caseController.submitDiagnosis);
  return router;
}

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app; 