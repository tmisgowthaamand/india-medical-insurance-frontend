# Vercel Environment Variables - Quick Setup

## 🚨 Fix for "Secret does not exist" Error

If you're getting this error:
```
Environment Variable "VITE_API_URL" references Secret "vite_api_url", which does not exist.
```

**✅ Solution**: The `vercel.json` file has been fixed. Follow these steps:

## 📋 Step-by-Step Setup

### 1. In Vercel Dashboard

1. Go to your project in Vercel
2. Click **Settings** tab
3. Click **Environment Variables** in sidebar
4. Add these variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `VITE_API_URL` | `https://your-backend.onrender.com` | Production |
| `VITE_APP_NAME` | `Medical Insurance ML Dashboard` | All |
| `VITE_APP_VERSION` | `1.0.0` | All |

### 2. Important Notes

- ✅ **DO**: Set variables in Vercel dashboard
- ❌ **DON'T**: Use `@secret_name` references in vercel.json
- ✅ **DO**: Use your actual Render backend URL
- ❌ **DON'T**: Include trailing slashes in URLs

### 3. After Setting Variables

1. Go to **Deployments** tab
2. Click **Redeploy** on latest deployment
3. Wait for build to complete

## 🔧 Correct vercel.json

Your `vercel.json` should look like this (no env references):

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## ✅ Verification

After deployment, check:
1. Build logs show no environment variable errors
2. App loads without console errors
3. API calls work (check Network tab in browser)

## 🆘 Still Having Issues?

1. **Clear browser cache**
2. **Check exact variable names** (must start with `VITE_`)
3. **Verify backend URL** is accessible
4. **Check browser console** for errors
5. **Review Vercel build logs**

## 📞 Quick Test

Add this temporarily to your React component to test:
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
```

You should see your backend URL in the browser console.
