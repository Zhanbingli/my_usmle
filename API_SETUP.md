# 🩺 医学AI平台 - API配置指南

本指南将帮助您配置真实的API，使所有功能正常工作。

## 📋 目录

1. [快速开始](#快速开始)
2. [Gemini AI API 配置](#gemini-ai-api-配置)
3. [PubMed API 配置](#pubmed-api-配置)
4. [测试API连接](#测试api连接)
5. [故障排除](#故障排除)

## 🚀 快速开始

### 1. 复制环境配置文件

```bash
cp env.example .env.local
```

### 2. 编辑配置文件

打开 `.env.local` 文件，根据以下指南填入相应的API密钥。

## 🤖 Gemini AI API 配置

### 获取API密钥

1. 访问 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 登录您的Google账户
3. 点击 "Create API Key"
4. 选择一个现有项目或创建新项目
5. 复制生成的API密钥

### 配置环境变量

在 `.env.local` 文件中设置：

```bash
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta
```

### 功能

- ✅ AI智能问诊
- ✅ 医学问题解答
- ✅ 临床思维训练
- ✅ 病例分析

### API限制

- 免费版本：每分钟15个请求，每天1500个请求
- 付费版本：根据使用量计费

## 📚 PubMed API 配置

### 方式一：免费使用（推荐开始）

PubMed的NCBI Entrez API是免费的，无需API密钥即可使用：

```bash
PUBMED_API_URL=https://eutils.ncbi.nlm.nih.gov/entrez/eutils
# PUBMED_API_KEY 可以留空
```

### 方式二：注册NCBI账户（推荐生产环境）

为了避免IP限制和获得更高的请求配额：

1. 访问 [NCBI Account](https://www.ncbi.nlm.nih.gov/account/)
2. 创建免费账户
3. 在账户设置中获取API密钥
4. 配置环境变量：

```bash
PUBMED_API_URL=https://eutils.ncbi.nlm.nih.gov/entrez/eutils
PUBMED_API_KEY=your_ncbi_api_key_here
```

### 功能

- ✅ 医学文献搜索
- ✅ 按期刊、作者、日期筛选
- ✅ 文章详情查看
- ✅ 相关文章推荐

### API限制

- 无API密钥：每秒3个请求
- 有API密钥：每秒10个请求

## 🧪 测试API连接

### 1. 启动服务器

```bash
npm run dev
```

### 2. 测试PubMed API

```bash
curl "http://localhost:3001/api/pubmed/search?query=artificial%20intelligence"
```

期望响应：
```json
{
  "success": true,
  "data": [
    {
      "pmid": "...",
      "title": "...",
      "authors": [...],
      "journal": "...",
      "publicationDate": "...",
      "url": "..."
    }
  ]
}
```

### 3. 测试Gemini API

```bash
curl -X POST "http://localhost:3001/api/gemini/query" \
  -H "Content-Type: application/json" \
  -d '{"query": "什么是高血压？"}'
```

期望响应：
```json
{
  "success": true,
  "data": {
    "answer": "高血压是一种常见的心血管疾病...",
    "query": "什么是高血压？"
  }
}
```

## 🔧 故障排除

### PubMed搜索失败

**症状**: 点击搜索后显示"搜索失败，请稍后重试"

**可能原因**:
1. 网络连接问题
2. API请求频率过高
3. 服务器未启动

**解决方案**:
1. 检查网络连接
2. 等待几秒后重试
3. 检查后端服务器是否在端口3001运行
4. 查看浏览器开发者工具的网络选项卡

### Gemini AI无响应

**症状**: AI问诊页面无法获得回复

**可能原因**:
1. API密钥未配置或错误
2. API配额已用完
3. 网络连接问题

**解决方案**:
1. 检查`.env.local`中的`GEMINI_API_KEY`
2. 访问Google AI Studio检查API使用情况
3. 如果没有API密钥，系统会使用模拟响应

### 检查服务器日志

查看后端日志了解详细错误信息：

```bash
# 在终端中查看实时日志
npm run server:dev
```

常见日志信息：
- `PubMed API Error`: PubMed API调用失败
- `Gemini API Error`: Gemini API调用失败
- `Using mock data`: 使用模拟数据（API不可用时）

## 📊 API使用监控

### Gemini API配额监控

访问 [Google Cloud Console](https://console.cloud.google.com/) 查看API使用情况和配额。

### PubMed API监控

NCBI没有提供详细的使用监控，但如果请求频率过高，会收到429错误。

## 🔒 安全注意事项

1. **永远不要将API密钥提交到版本控制系统**
2. **定期轮换API密钥**
3. **在生产环境中使用环境变量或密钥管理服务**
4. **监控API使用情况避免意外费用**

## 💡 优化建议

### 生产环境配置

1. **启用缓存**: 实现Redis缓存减少API调用
2. **限流**: 实现请求限流保护API配额
3. **错误重试**: 实现指数退避重试机制
4. **监控**: 设置API调用监控和告警

### 开发环境配置

1. **使用模拟数据**: 在没有API密钥时使用模拟响应
2. **调试模式**: 启用详细的API调用日志
3. **热重载**: 开发时自动重启服务器

## 📞 技术支持

如果您在配置过程中遇到问题：

1. 检查本文档的故障排除部分
2. 查看项目的GitHub Issues
3. 联系开发团队

---

🎉 **恭喜！** 配置完成后，您将拥有一个功能完整的医学AI平台，包括：

- 🔍 真实的PubMed文献搜索
- 🤖 智能AI医学问答
- 📚 互动式病例学习
- 👤 个人学习进度追踪 