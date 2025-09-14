// 本地开发服务器 - 模拟Firebase Functions环境
const express = require('express');
const cors = require('cors');
const path = require('path');
const admin = require('firebase-admin');

// 加载环境变量（从项目根的 .env.local/.env）
try {
  const dotenv = require('dotenv');
  // 先尝试加载根目录的 .env.local，其次 .env
  dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
} catch (_) {}

const app = express();
const PORT = process.env.PORT || 3001;

// 初始化 Firebase Admin（本地）
try {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || 'lizhanbing';
  if (!admin.apps.length) {
    admin.initializeApp({ projectId });
  }
} catch (e) {
  console.warn('Firebase Admin init warning:', e.message);
}

// CORS（本地默认允许 3000）
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
app.use(cors({
  origin: (origin, cb) => { if (!origin || allowedOrigins.includes(origin)) return cb(null, true); return cb(new Error('Not allowed by CORS')); },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 简单限流（内存）
const rateBuckets = new Map();
function rateLimiter(limit = 60, windowMs = 60 * 1000) {
  return (req, res, next) => {
    const key = `${req.ip}`;
    const now = Date.now();
    const bucket = rateBuckets.get(key) || { count: 0, start: now };
    if (now - bucket.start > windowMs) { bucket.count = 0; bucket.start = now; }
    bucket.count += 1; rateBuckets.set(key, bucket);
    if (bucket.count > limit) return res.status(429).json({ success: false, error: 'Too many requests' });
    next();
  };
}

// 添加请求日志
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', req.body);
  }
  if (req.query && Object.keys(req.query).length > 0) {
    console.log('Query params:', req.query);
  }
  next();
});

// 引入控制器
const geminiController = require('./controllers/geminiController');
const pubmedController = require('./controllers/pubmedController');
const caseController = require('./controllers/caseController');
const agentController = require('./controllers/agentController');

// 简单认证中间件（开发环境）
const db = admin.firestore();
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // 允许部分公开路由
      if (req.path.includes('/health') || (req.path.includes('/cases') && req.method === 'GET') || (req.path.includes('/api/gemini/query') && req.method === 'POST')) {
        return next();
      }
      // 本地开发可选跳过认证（仅用于本地调试）
      if (String(process.env.ALLOW_DEV_AUTH_BYPASS).toLowerCase() === 'true') {
        req.user = { uid: 'dev-user', email: 'dev@example.com', role: 'admin' };
        return next();
      }
      return res.status(401).json({ success: false, error: 'No authorization token provided' });
    }
    const token = authHeader.split('Bearer ')[1];
    const decoded = await admin.auth().verifyIdToken(token);
    const userDoc = await db.collection('users').doc(decoded.uid).get();
    req.user = { uid: decoded.uid, email: decoded.email, ...userDoc.data() };
    next();
  } catch (e) {
    console.error('Dev auth error:', e.message);
    // 可选跳过认证（仅用于本地调试）
    if (String(process.env.ALLOW_DEV_AUTH_BYPASS).toLowerCase() === 'true') {
      req.user = { uid: 'dev-user', email: 'dev@example.com', role: 'admin' };
      return next();
    }
    return res.status(401).json({ success: false, error: 'Invalid authorization token' });
  }
};

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Medical AI Platform API is running',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// API路由
const geminiRouter = express.Router();
geminiRouter.post('/query', rateLimiter(60, 60 * 1000), geminiController.processMedicalQuery);
geminiRouter.post('/clinical-reasoning', geminiController.simulateClinicalReasoning);
geminiRouter.get('/sessions/:sessionId', authenticateUser, geminiController.getSessionById);
geminiRouter.patch('/sessions/:sessionId', authenticateUser, geminiController.updateSessionTitle);
geminiRouter.delete('/sessions/:sessionId', authenticateUser, geminiController.deleteSession);
geminiRouter.get('/users/:userId/sessions', authenticateUser, async (req, res) => {
  try {
    if (req.params.userId !== req.user.uid && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }
    const sessionsSnapshot = await db.collection('sessions')
      .where('userId', '==', req.params.userId)
      .orderBy('createdAt', 'desc')
      .get();
    const sessions = sessionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: sessions });
  } catch (error) {
    console.error('Error getting sessions:', error);
    res.status(500).json({ success: false, error: 'Failed to get sessions' });
  }
});

const pubmedRouter = express.Router();
pubmedRouter.get('/search', pubmedController.searchPubMed);
pubmedRouter.post('/search', pubmedController.searchPubMed);
pubmedRouter.get('/articles/:pmid', pubmedController.getArticleDetails);
pubmedRouter.get('/articles/:pmid/related', pubmedController.getRelatedArticles);
pubmedRouter.post('/articles/:pmid/save', authenticateUser, pubmedController.saveArticle);
pubmedRouter.get('/users/:userId/saved', authenticateUser, pubmedController.getSavedArticles);

const caseRouter = express.Router();
caseRouter.get('/', caseController.getAllCases);
caseRouter.get('/:id', caseController.getCaseById);
caseRouter.post('/:id/diagnose', caseController.submitDiagnosis);

const agentRouter = express.Router();
agentRouter.post('/act', rateLimiter(30, 60 * 1000), agentController.act);

app.use('/api/gemini', geminiRouter);
app.use('/api/pubmed', pubmedRouter);
app.use('/api/cases', caseRouter);
app.use('/api/agent', agentRouter);

// 404处理
app.use('*', (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🔥 医学AI平台后端服务启动成功！`);
  console.log(`📡 API地址: http://localhost:${PORT}`);
  console.log(`💊 健康检查: http://localhost:${PORT}/health`);
  console.log(`🔍 PubMed搜索: http://localhost:${PORT}/api/pubmed/search`);
  console.log(`🤖 AI问诊: http://localhost:${PORT}/api/gemini/query`);
  console.log(`📚 病例学习: http://localhost:${PORT}/api/cases`);
  console.log(`⭐ 本地开发环境已就绪！`);
});

module.exports = app; 
