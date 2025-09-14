# 🩺 医学AI平台 (Medical AI Platform)

一个现代化的医学学习和AI问诊平台，集成了PubMed文献搜索、智能AI问诊、病例学习和个人学习管理功能。

## ✨ 主要功能

### 🤖 AI智能问诊
- 基于Google Gemini AI的医学问答
- 专业的医学建议和诊断思路
- 临床思维训练和病例分析

### 📚 PubMed文献搜索
- 实时搜索PubMed数据库
- 高级筛选功能（期刊、作者、日期）
- 文章详情查看和收藏功能

### 🏥 病例学习系统
- 互动式病例学习
- 分科室和难度分级
- 诊断提交和专家反馈

### 👤 个人学习中心
- 学习进度追踪
- 统计数据可视化
- 个人资料管理

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- npm 或 yarn
- 现代浏览器（Chrome, Firefox, Safari, Edge）

### 安装和运行

1. **克隆项目**
   ```bash
   git clone [your-repo-url]
   cd usmle_test
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置API（重要！）**
   ```bash
   cp env.example .env.local
   ```
   
   编辑 `.env.local` 文件，配置API密钥：
   ```bash
   # Gemini AI API配置
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta
   
   # PubMed API配置（可选，不配置时使用免费API）
   PUBMED_API_URL=https://eutils.ncbi.nlm.nih.gov/entrez/eutils
   PUBMED_API_KEY=your_ncbi_api_key_here
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问应用**
   - 前端: http://localhost:3000
   - 后端API: http://localhost:3001

## 🔧 API配置指南

### 详细配置说明

请查看 [API_SETUP.md](./API_SETUP.md) 获取完整的API配置指南，包括：

- 🤖 Gemini AI API申请和配置
- 📚 PubMed API配置选项
- 🧪 API测试和验证
- 🔧 故障排除指南

### 功能状态

| 功能模块 | 状态 | 说明 |
|---------|------|------|
| 🏠 首页导航 | ✅ 完成 | 现代化响应式界面 |
| 🔐 用户认证 | ✅ 完成 | 登录/注册页面 |
| 🤖 AI问诊 | ✅ 完成 | 支持Gemini API + 模拟响应 |
| 📚 PubMed搜索 | ✅ 完成 | 真实API + 高级筛选 |
| 🏥 病例学习 | ✅ 完成 | 互动式学习体验 |
| 👤 个人中心 | ✅ 完成 | 进度追踪和数据可视化 |

## 🛠️ 技术栈

### 前端
- **React 18** - 现代React功能
- **TypeScript** - 类型安全
- **Ant Design** - 企业级UI组件库
- **React Router** - 客户端路由
- **React Query** - 数据获取和缓存
- **Zustand** - 轻量级状态管理

### 后端
- **Node.js** - JavaScript运行时
- **Express.js** - Web应用框架
- **Firebase Functions** - 云函数服务
- **Axios** - HTTP客户端

### API集成
- **Google Gemini AI** - 智能对话和医学问答
- **PubMed NCBI API** - 医学文献搜索
- **自定义医学API** - 病例和用户管理

## 📁 项目结构

```
usmle_test/
├── src/                      # 前端源码
│   ├── components/           # React组件
│   │   ├── layout/          # 布局组件
│   │   └── common/          # 通用组件
│   ├── pages/               # 页面组件
│   │   ├── HomePage.tsx     # 首页
│   │   ├── LoginPage.tsx    # 登录页
│   │   ├── QueryPage.tsx    # AI问诊
│   │   ├── PubMedSearchPage.tsx # 文献搜索
│   │   ├── CasesPage.tsx    # 病例列表
│   │   ├── CaseDetailPage.tsx # 病例详情
│   │   └── ProfilePage.tsx  # 个人中心
│   ├── hooks/               # 自定义Hooks
│   ├── api/                 # API客户端
│   ├── stores/              # Zustand状态管理
│   ├── types/               # TypeScript类型定义
│   └── utils/               # 工具函数
├── functions/               # 后端API
│   ├── controllers/         # 控制器
│   ├── local-dev.js         # 本地开发服务器
│   └── index.js             # Firebase Functions入口
├── public/                  # 静态资源
├── env.example              # 环境变量示例
├── API_SETUP.md            # API配置指南
└── README.md               # 项目说明
```

## 🔗 API端点

### Gemini AI API
```
POST /api/gemini/query
POST /api/gemini/clinical-reasoning
```

### PubMed API
```
GET/POST /api/pubmed/search
GET /api/pubmed/articles/:pmid
```

### 病例API
```
GET /api/cases
GET /api/cases/:id
POST /api/cases/:id/diagnose
```

## 🧪 开发指南

### 启动开发环境

```bash
# 启动前端和后端
npm run dev

# 仅启动前端
npm start

# 仅启动后端
npm run server:dev

# 类型检查
npm run type-check

# 构建生产版本
npm run build
```

### 代码质量

项目使用以下工具确保代码质量：
- **TypeScript** - 静态类型检查
- **ESLint** - 代码规范检查
- **Prettier** - 代码格式化

### 测试

```bash
# 运行测试
npm test

# 测试API端点
curl "http://localhost:3001/api/pubmed/search?query=COVID-19"
curl -X POST "http://localhost:3001/api/gemini/query" \
  -H "Content-Type: application/json" \
  -d '{"query": "什么是高血压？"}'
```

## 🚀 部署

### 生产环境部署

1. **构建项目**
   ```bash
   npm run build
   ```

2. **配置环境变量**
   - 设置生产环境的API密钥
   - 配置数据库连接（如需要）

3. **部署选项**
   - **Vercel**: 自动部署React应用
   - **Netlify**: 静态站点部署
   - **Firebase Hosting**: Google云平台部署
   - **Docker**: 容器化部署

### 环境变量配置

生产环境需要配置以下环境变量：
```bash
NODE_ENV=production
GEMINI_API_KEY=your_production_api_key
PUBMED_API_URL=https://eutils.ncbi.nlm.nih.gov/entrez/eutils
PUBMED_API_KEY=your_production_api_key
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 支持

如果您在使用过程中遇到问题：

1. 查看 [API_SETUP.md](./API_SETUP.md) 配置指南
2. 检查 GitHub Issues
3. 联系开发团队

---

## 🎯 路线图

- [ ] 用户认证系统集成
- [ ] 数据库持久化
- [ ] 更多AI模型支持
- [ ] 移动端适配
- [ ] 多语言支持
- [ ] 高级学习分析

---

**开发团队** | **版本** v1.0.0 | **最后更新** 2024年12月 