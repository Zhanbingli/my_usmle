// 本地开发服务器 - 模拟Firebase Functions环境
const express = require('express');
const cors = require('cors');

// 复用functions的主要逻辑
const { app: firebaseApp } = require('./index');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 将Firebase Function包装为普通Express应用
app.use('/', (req, res, next) => {
  // 模拟Firebase Functions的req/res对象
  firebaseApp(req, res);
});

app.listen(PORT, () => {
  console.log(`🔥 Firebase Functions 本地开发服务器运行在端口 ${PORT}`);
  console.log(`📡 API地址: http://localhost:${PORT}/api`);
  console.log(`💡 这是Firebase Functions的本地模拟环境`);
});

module.exports = app; 