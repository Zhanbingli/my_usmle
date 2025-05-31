# 智能问诊与临床思维训练平台

基于Gemini API和PubMed数据库的医学AI平台，帮助医学生和医生提升临床思维能力和诊断技能。

## 功能特点

- 智能问诊：通过Gemini AI回答医学问题
- 文献查询：集成PubMed数据库，提供最新医学研究
- 临床思维训练：模拟真实病例，训练诊断决策能力
- USMLE考试准备：提供模拟题和解析

## 技术栈

- 前端：React.js (使用Create React App)
- 后端：Node.js/Express
- AI：Google Gemini API
- 数据源：PubMed API

## 项目结构

```
usmle_test/
├── public/                 # 静态资源
│   ├── index.html         # HTML模板
│   ├── favicon.ico        # 网站图标
│   └── manifest.json      # PWA配置
├── src/                   # 前端源码
│   ├── components/        # React组件
│   ├── pages/            # 页面组件
│   ├── api/              # API调用
│   ├── App.js            # 主应用组件
│   └── index.js          # 入口文件
├── server/               # 后端源码
│   ├── controllers/      # 控制器
│   ├── routes/          # 路由
│   ├── models/          # 数据模型
│   └── index.js         # 服务器入口
└── package.json         # 项目配置
```

## 安装与使用

```bash
# 安装依赖
npm install

# 启动开发环境（前端+后端）
npm run dev

# 只启动前端
npm start

# 只启动后端
npm run server

# 构建生产版本
npm run build

# 运行测试
npm test
```

## 环境变量配置

在项目根目录创建`.env`文件，添加以下配置：

```env
# Google Gemini API密钥
GEMINI_API_KEY=your_gemini_api_key_here

# PubMed API密钥（可选）
PUBMED_API_KEY=your_pubmed_api_key_here

# 服务器端口
PORT=3001

# 环境模式
NODE_ENV=development
```

## 开发说明

- 前端使用Create React App，无需额外的webpack配置
- 后端API运行在3001端口，前端开发服务器运行在3000端口
- 开发模式下前端会自动代理API请求到后端

## 许可证

MIT 