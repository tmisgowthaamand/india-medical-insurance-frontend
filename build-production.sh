#!/bin/bash
# Production build script for frontend

echo "🔧 Building frontend for production..."

# Set environment variables for production build
export VITE_API_URL=https://india-medical-insurance-backend.onrender.com
export VITE_API_BASE_URL=https://india-medical-insurance-backend.onrender.com

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist/

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Build for production
echo "🏗️ Building for production..."
npm run build

echo "✅ Build complete! Files are in the dist/ directory"
echo "🚀 Ready for deployment to Vercel"
