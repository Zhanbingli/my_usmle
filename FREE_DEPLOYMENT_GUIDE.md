# 🆓 免费部署方案指南

## 部署选项对比

### 1. 🔥 Firebase (Google) - **强烈推荐**

**免费额度：**
- 125GB/月 流量
- 10GB 存储空间
- 每日 50,000 次函数调用
- 自定义域名支持

**优势：**
- Google 基础设施，全球CDN
- 自动SSL证书
- 支持静态托管 + Cloud Functions
- 与域名 `medical.zhanbing.site` 完美集成

**部署步骤：**
```bash
# 1. 安装Firebase CLI
npm install -g firebase-tools

# 2. 登录Firebase
firebase login

# 3. 初始化项目
firebase init
# 选择: Hosting, Functions
# 选择创建新项目或使用现有项目

# 4. 配置环境变量
firebase functions:config:set gemini.api_key="your-api-key"

# 5. 部署
./deploy-firebase.sh
```

**自定义域名设置：**
1. 在Firebase Console中添加自定义域名
2. 按照提示配置DNS记录
3. Firebase会自动提供SSL证书

---

### 2. ▲ Vercel - **前端友好**

**免费额度：**
- 100GB/月 流量
- 无限静态网站
- 12个Serverless Functions
- 自定义域名支持

**优势：**
- 专为React/Next.js优化
- 极快的部署速度
- 优秀的开发体验

**部署步骤：**
```bash
# 1. 安装Vercel CLI
npm install -g vercel

# 2. 登录并部署
vercel

# 3. 设置环境变量
vercel env add GEMINI_API_KEY

# 4. 重新部署
vercel --prod
```

---

### 3. 🌐 Netlify - **静态网站专家**

**免费额度：**
- 100GB/月 流量
- 300分钟/月 构建时间
- 125,000次/月 Serverless Functions
- 自定义域名支持

**适用场景：**
- 主要是静态前端 + 少量API

**部署步骤：**
```bash
# 1. 安装Netlify CLI
npm install -g netlify-cli

# 2. 登录并部署
netlify deploy

# 3. 生产部署
netlify deploy --prod
```

---

### 4. 🚂 Railway - **新兴之星**

**免费额度：**
- $5/月 信用额度
- 512MB RAM
- 1GB存储

**优势：**
- 支持数据库
- 简单易用
- 类似Heroku体验

---

### 5. 🎨 Render - **全栈友好**

**免费额度：**
- 750小时/月 (约31天)
- 512MB RAM
- 自动SSL

**注意：**
- 空闲时会休眠，冷启动较慢

---

## 🏆 推荐方案排序

### 对于你的医学AI平台：

1. **🥇 Firebase** - 最佳选择
   - 完美支持你的域名
   - 充足的免费额度
   - Google基础设施可靠

2. **🥈 Vercel** - 备选方案
   - 对React项目友好
   - 部署简单
   - 性能优秀

3. **🥉 Railway** - 如果需要数据库
   - 支持PostgreSQL等
   - 全栈应用友好

## 🛠 Firebase 部署详细步骤

### 第一步：准备工作
```bash
# 确保你在项目目录
cd /path/to/your/usmle_test

# 安装Firebase CLI
npm install -g firebase-tools

# 登录Firebase
firebase login
```

### 第二步：初始化Firebase项目
```bash
firebase init
```
选择：
- ✅ Hosting: Configure files for Firebase Hosting
- ✅ Functions: Configure a Cloud Functions directory

### 第三步：配置
- **Project**: 创建新项目，建议命名为 `medical-ai-platform`
- **Public directory**: `build`
- **Single-page app**: `Yes`
- **Functions language**: `JavaScript`
- **Install dependencies**: `Yes`

### 第四步：设置环境变量
```bash
# 设置Gemini API密钥
firebase functions:config:set gemini.api_key="your-actual-api-key"

# 查看配置
firebase functions:config:get
```

### 第五步：部署
```bash
# 使用我们的部署脚本
./deploy-firebase.sh
```

### 第六步：设置自定义域名
1. 打开 [Firebase Console](https://console.firebase.google.com)
2. 选择你的项目
3. 进入 Hosting 部分
4. 点击 "Add custom domain"
5. 输入 `medical.zhanbing.site`
6. 按照提示配置DNS记录：
   ```
   A记录: medical.zhanbing.site -> Firebase提供的IP
   ```

## 🔧 常见问题

**Q: Firebase Functions冷启动慢怎么办？**
A: 免费版本有冷启动延迟，可以考虑使用定时函数保持温热。

**Q: 如何查看日志？**
A: 
```bash
firebase functions:log
```

**Q: 如何更新部署？**
A: 
```bash
# 修改代码后直接运行
./deploy-firebase.sh
```

**Q: 域名配置多久生效？**
A: DNS解析通常需要几分钟到几小时，SSL证书会自动配置。

## 💰 费用对比

| 平台 | 流量 | 函数调用 | 存储 | 自定义域名 |
|------|------|----------|------|------------|
| Firebase | 125GB/月 | 50K/日 | 10GB | ✅ 免费 |
| Vercel | 100GB/月 | 100GB-sec | 无限 | ✅ 免费 |
| Netlify | 100GB/月 | 125K/月 | 100GB | ✅ 免费 |
| Railway | 按使用付费 | 无限 | 1GB | ✅ 免费 |
| Render | 750小时/月 | 无限 | 1GB | ✅ 免费 |

## 🎯 结论

**推荐使用 Firebase**，因为：
1. 免费额度充足
2. 支持自定义域名
3. 全球CDN性能好
4. Google基础设施可靠
5. 部署配置已经为你准备好了 