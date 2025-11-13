#!/bin/bash

# 確保不使用 sudo/root 身份運行
if [ "$EUID" -eq 0 ]; then 
   echo "⚠️ 警告：請勿使用 sudo 運行此腳本"
   echo "請直接執行：./run.sh"
   exit 1
fi

# 進入 backend 資料夾，設定環境變數並啟動後端
cd backend || exit 1
export PATH="/Users/peter/.local/bin:$PATH"
echo "📍 PATH: $PATH"
echo "👤 當前用戶: $(whoami)"
echo "🏠 HOME: $HOME"
node index.js &

# 返回上一層
cd ..

# 進入 frontend 資料夾並啟動 Next.js 前端
cd frontend || exit 1
npm run dev
