#!/bin/bash

# 医学AI平台开发启动脚本
echo "🏥 启动医学AI平台开发环境..."

# 设置环境变量，禁用代理
export HTTP_PROXY=""
export HTTPS_PROXY=""
export NO_PROXY="localhost,127.0.0.1,*.local"

# 设置React开发环境
export REACT_APP_API_BASE_URL="http://localhost:3001/api"
export REACT_APP_ENV="development"

# 检查Node.js版本
echo "📋 检查系统环境..."
node_version=$(node -v)
echo "Node.js版本: $node_version"

# 检查端口是否被占用
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  端口3000已被占用，正在清理..."
    pkill -f "react-scripts start" || true
fi

if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  端口3001已被占用，正在清理..."
    pkill -f "node.*3001" || true
fi

# 安装依赖（如果需要）
if [ ! -d "node_modules" ]; then
    echo "📦 安装前端依赖..."
    npm install
fi

if [ ! -d "functions/node_modules" ]; then
    echo "📦 安装后端依赖..."
    cd functions && npm install && cd ..
fi

# 启动开发服务器
echo "🚀 启动开发服务器..."
echo "前端: http://localhost:3000"
echo "后端: http://localhost:3001"
echo ""

# 使用concurrently同时启动前端和后端
npm run dev 