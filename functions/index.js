const functions = require('firebase-functions');
const { defineSecret } = require('firebase-functions/params');
const { onRequest } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

// 定义secrets
const geminiApiKey = defineSecret('GEMINI_API_KEY');

// 初始化Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// 创建Express应用
const app = express();

// CORS 白名单（可通过环境变量 CORS_ORIGIN=domain1,domain2 覆盖）
const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
const defaultOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
const origins = allowedOrigins.length > 0 ? allowedOrigins : defaultOrigins;

// 中间件
app.use(cors({
  origin: function(origin, callback) {
    // 允许无 Origin 的请求（如移动端、curl）
    if (!origin) return callback(null, true);
    if (origins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 简单限流（内存）
const rateBuckets = new Map();
function rateLimiter(limit = 60, windowMs = 60 * 1000) {
  return (req, res, next) => {
    const key = `${req.ip}:${req.user?.uid || 'anon'}`;
    const now = Date.now();
    const bucket = rateBuckets.get(key) || { count: 0, start: now };
    if (now - bucket.start > windowMs) {
      bucket.count = 0;
      bucket.start = now;
    }
    bucket.count += 1;
    rateBuckets.set(key, bucket);
    if (bucket.count > limit) {
      return res.status(429).json({ success: false, error: 'Too many requests' });
    }
    next();
  };
}

// 请求日志（默认关闭，生产仅在显式开启时记录）
const ENABLE_REQUEST_LOGS = String(process.env.ENABLE_REQUEST_LOGS || '').toLowerCase() === 'true';
app.use((req, res, next) => {
  if (ENABLE_REQUEST_LOGS || process.env.NODE_ENV === 'development') {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    if (req.body && Object.keys(req.body).length > 0) {
      console.log('Request body:', req.body);
    }
    if (req.query && Object.keys(req.query).length > 0) {
      console.log('Query params:', req.query);
    }
  }
  next();
});

// 认证中间件
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // 对于一些公开API，允许匿名访问
      if (ENABLE_REQUEST_LOGS || process.env.NODE_ENV === 'development') {
        console.log('Checking path for public access:', req.path);
      }
      if (req.path.includes('/health') || 
          (req.path.includes('/cases') && req.method === 'GET') ||
          (req.path.includes('/api/gemini/query') && req.method === 'POST') ||
          (req.path.includes('/gemini/query') && req.method === 'POST')) {
        if (ENABLE_REQUEST_LOGS || process.env.NODE_ENV === 'development') {
          console.log('Allowing public access to:', req.path);
        }
        return next();
      }
      if (ENABLE_REQUEST_LOGS || process.env.NODE_ENV === 'development') {
        console.log('No auth token and not public route:', req.path);
      }
      return res.status(401).json({
        success: false,
        error: 'No authorization token provided'
      });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // 获取用户档案
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      ...userDoc.data()
    };
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({
      success: false,
      error: 'Invalid authorization token'
    });
  }
};

// 应用认证中间件到需要的路由（移除gemini）
app.use('/api/user', authenticateUser);
app.use('/api/cases/:id/diagnose', authenticateUser);

// 引入控制器
const geminiController = require('./controllers/geminiController');
const pubmedController = require('./controllers/pubmedController');
const caseController = require('./controllers/caseController');
const agentController = require('./controllers/agentController');

// 健康检查 - 支持两种路径
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Medical AI Platform API is running',
    timestamp: new Date().toISOString(),
    environment: 'Firebase Functions'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Medical AI Platform API is running',
    timestamp: new Date().toISOString(),
    environment: 'Firebase Functions'
  });
});

// 用户相关路由
const userRouter = express.Router();

// 获取用户档案
userRouter.get('/profile', async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'User profile not found'
      });
    }
    
    res.json({
      success: true,
      data: userDoc.data()
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user profile'
    });
  }
});

// 更新用户档案
userRouter.put('/profile', async (req, res) => {
  try {
    const updates = {
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    await db.collection('users').doc(req.user.uid).update(updates);
    
    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user profile'
    });
  }
});

// API路由
const geminiRouter = express.Router();
geminiRouter.post('/query', rateLimiter(60, 60 * 1000), geminiController.processMedicalQuery);
geminiRouter.post('/clinical-reasoning', geminiController.simulateClinicalReasoning);
// 会话管理
geminiRouter.get('/sessions/:sessionId', authenticateUser, geminiController.getSessionById);
geminiRouter.patch('/sessions/:sessionId', authenticateUser, geminiController.updateSessionTitle);
geminiRouter.delete('/sessions/:sessionId', authenticateUser, geminiController.deleteSession);

// 会话管理路由（需要认证）
geminiRouter.get('/users/:userId/sessions', authenticateUser, async (req, res) => {
  try {
    if (req.params.userId !== req.user.uid && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }
    
    const sessionsSnapshot = await db.collection('sessions')
      .where('userId', '==', req.params.userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    const sessions = sessionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    console.error('Error getting sessions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get sessions'
    });
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
agentRouter.post('/act', authenticateUser, rateLimiter(30, 60 * 1000), agentController.act);

// 应用路由
app.use('/api/user', userRouter);
app.use('/api/gemini', geminiRouter);
app.use('/api/pubmed', pubmedRouter);
app.use('/api/cases', caseRouter);
app.use('/api/agent', agentRouter);

// 为了兼容性，保留原有的无前缀路由
app.use('/gemini', geminiRouter);
app.use('/pubmed', pubmedRouter);
app.use('/cases', caseRouter);

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

// 移除非必要导出以减小攻击面（test/db）

// 导出Firebase Function用于云端部署
exports.api = onRequest(
  {
    secrets: [geminiApiKey]
  },
  app
);
