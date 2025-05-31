#!/bin/bash

echo "🚀 开始部署医学AI平台到 Firebase..."

# 检查Firebase CLI
if ! command -v firebase &> /dev/null; then
    echo "📦 安装 Firebase CLI..."
    npm install -g firebase-tools
fi

# 构建前端
echo "🏗️ 构建前端应用..."
npm run build

# 检查构建结果
if [ ! -d "build" ]; then
    echo "❌ 前端构建失败！"
    exit 1
fi

echo "✅ 前端构建完成！"

# 安装Cloud Functions依赖
echo "📦 安装Cloud Functions依赖..."
cd functions
npm install
cd ..

# 部署到Firebase
echo "🚀 部署到Firebase..."
firebase deploy

echo "🎉 部署完成！"
echo "🌐 访问你的网站: https://your-project-id.web.app"
echo "🔧 API地址: https://your-project-id.web.app/api"

echo ""
echo "⚠️ 首次部署需要："
echo "1. 登录 Firebase: firebase login"
echo "2. 初始化项目: firebase init"
echo "3. 设置环境变量: firebase functions:config:set gemini.api_key=\"your-key\"" 