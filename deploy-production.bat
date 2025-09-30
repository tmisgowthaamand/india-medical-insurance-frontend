@echo off
echo 🚀 DEPLOYING FRONTEND TO PRODUCTION
echo =====================================

echo 📋 Step 1: Setting Vercel Environment Variables...
vercel env add VITE_API_URL production
echo Enter: https://india-medical-insurance-backend.onrender.com

vercel env add VITE_API_BASE_URL production
echo Enter: https://india-medical-insurance-backend.onrender.com

echo 📋 Step 2: Building and Deploying to Production...
vercel --prod

echo ✅ Deployment Complete!
echo 📱 Check your Vercel dashboard for the deployment URL
echo 🔍 Verify the API calls go to the correct backend URL

pause
