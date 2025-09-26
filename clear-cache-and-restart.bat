@echo off
echo 🧹 Clearing development cache and restarting...

REM Stop any running development servers
echo 📛 Stopping any running servers...
taskkill /f /im node.exe 2>nul || echo No Node.js processes found

REM Clear various caches
echo 🗑️ Clearing caches...
if exist node_modules\.vite rmdir /s /q node_modules\.vite
if exist node_modules\.cache rmdir /s /q node_modules\.cache
if exist .vite rmdir /s /q .vite
if exist dist rmdir /s /q dist

REM Clear npm cache
echo 📦 Clearing npm cache...
npm cache clean --force

REM Reinstall dependencies
echo 🔄 Reinstalling dependencies...
npm install --legacy-peer-deps

REM Start development server
echo 🚀 Starting development server...
npm run dev

echo ✅ Cache cleared and development server restarted!
