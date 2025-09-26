@echo off
REM Production build script for frontend (Windows)

echo 🔧 Building frontend for production...

REM Set environment variables for production build
set VITE_API_URL=https://india-medical-insurance-backend.onrender.com
set VITE_API_BASE_URL=https://india-medical-insurance-backend.onrender.com
set VITE_APP_NAME=Medical Insurance ML Dashboard
set VITE_APP_VERSION=1.0.0

REM Clean previous build
echo 🧹 Cleaning previous build...
if exist dist rmdir /s /q dist
if exist node_modules\.vite rmdir /s /q node_modules\.vite

REM Install dependencies
echo 📦 Installing dependencies...
npm install --legacy-peer-deps

REM Build for production
echo 🏗️ Building for production...
npm run build

echo ✅ Build complete! Files are in the dist/ directory
echo 🔍 Checking built files for correct URLs...
findstr /s "your-backend-url" dist\* && echo ❌ Found placeholder URLs! || echo ✅ No placeholder URLs found
echo 🚀 Ready for deployment to Vercel
