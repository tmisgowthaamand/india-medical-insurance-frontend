# Fix Production Deployment Issues

## Problem
Frontend deployed on Vercel is trying to connect to localhost:8001 instead of the production backend URL, causing network timeouts and email failures.

## Root Cause
The frontend is not using the correct environment variables in production.

## Solution

### 1. Verify Backend URL
From the memories, the backend is deployed on Render with URL:
- **Backend URL**: `https://india-medical-insurance-backend.onrender.com`
- **Service ID**: `srv-d3b668ogjchc73f9ece0` (from memories)

### 2. Update Production Environment Variables

The `.env.production` file is correctly configured:
```
VITE_API_URL=https://india-medical-insurance-backend.onrender.com
VITE_API_BASE_URL=https://india-medical-insurance-backend.onrender.com
```

### 3. Ensure Vercel Uses Production Environment

**Option A: Set Environment Variables in Vercel Dashboard**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables for **Production** environment:
   ```
   VITE_API_URL = https://india-medical-insurance-backend.onrender.com
   VITE_API_BASE_URL = https://india-medical-insurance-backend.onrender.com
   ```

**Option B: Update vercel.json (Recommended)**
Update the vercel.json file to ensure proper environment variable handling.

### 4. Fix API Configuration Logic

The api.js file has fallback logic that might be interfering. Update the API base URL logic to properly handle production environment.

### 5. Redeploy Frontend

After making changes, redeploy the frontend to Vercel.

## Quick Fix Commands

1. **Update Vercel Environment Variables:**
   ```bash
   vercel env add VITE_API_URL production
   # Enter: https://india-medical-insurance-backend.onrender.com
   
   vercel env add VITE_API_BASE_URL production  
   # Enter: https://india-medical-insurance-backend.onrender.com
   ```

2. **Redeploy:**
   ```bash
   vercel --prod
   ```

## Verification

After deployment, check:
1. Browser console should show correct API URL
2. Network requests should go to Render backend
3. Email functionality should work without timeouts
4. No more "localhost:8001" connection attempts

## Backend Status Check

Verify the backend is running:
- URL: https://india-medical-insurance-backend.onrender.com
- Health check: https://india-medical-insurance-backend.onrender.com/
- Email endpoint: https://india-medical-insurance-backend.onrender.com/send-prediction-email
