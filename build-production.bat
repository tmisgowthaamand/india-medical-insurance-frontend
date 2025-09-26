@echo off
REM Production build script for frontend (Windows)

echo 🔧 Building frontend for production...

REM Set environment variables for production build
set VITE_API_URL=https://india-medical-insurance-backend.onrender.com
set VITE_API_BASE_URL=https://india-medical-insurance-backend.onrender.com

REM Clean previous build
echo 🧹 Cleaning previous build...
if exist dist rmdir /s /q dist

REM Install dependencies
echo 📦 Installing dependencies...
npm install --legacy-peer-deps

REM Build for production
echo 🏗️ Building for production...
npm run build

echo ✅ Build complete! Files are in the dist/ directory
echo 🚀 Ready for deployment to Vercel
