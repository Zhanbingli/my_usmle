#!/bin/bash

echo "🧹 开始清理旧的部署文件..."

# 删除server目录
if [ -d "server" ]; then
    echo "🗑️ 删除 server/ 目录..."
    rm -rf server/
    echo "✅ server/ 目录已删除"
else
    echo "ℹ️ server/ 目录不存在，跳过"
fi

# 删除传统部署相关文件
echo "🗑️ 删除传统部署配置文件..."

# PM2相关文件
[ -f "ecosystem.config.js" ] && rm ecosystem.config.js && echo "✅ 删除 ecosystem.config.js"
[ -f "deploy.sh" ] && rm deploy.sh && echo "✅ 删除 deploy.sh"

# Nginx配置
[ -f "nginx.conf" ] && rm nginx.conf && echo "✅ 删除 nginx.conf"

# 传统环境变量模板
[ -f "env.production.example" ] && rm env.production.example && echo "✅ 删除 env.production.example"

# 传统部署文档
[ -f "DEPLOYMENT.md" ] && rm DEPLOYMENT.md && echo "✅ 删除 DEPLOYMENT.md"

echo ""
echo "🎉 清理完成！"
echo "📁 保留的部署方案："
echo "  🔥 Firebase: firebase.json, functions/, deploy-firebase.sh"
echo "  ▲ Vercel: vercel.json"
echo "  📖 指南: FREE_DEPLOYMENT_GUIDE.md"

echo ""
echo "🚀 现在你可以使用："
echo "  • 本地开发: npm run dev"
echo "  • Firebase部署: ./deploy-firebase.sh"
echo "  • Vercel部署: vercel" 