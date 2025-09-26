# Vercel Deployment Setup Guide

This guide will help you deploy your Medical Insurance ML Dashboard frontend to Vercel.

## 🚀 Quick Deployment Steps

### 1. Connect Your Repository

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository: `india-medical-insurance-dashboard`

### 2. Configure Build Settings

When importing, configure these settings:

```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 3. Set Environment Variables

In your Vercel project dashboard, go to **Settings** → **Environment Variables** and add:

#### Required Environment Variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `VITE_API_URL` | `https://your-backend-url.onrender.com` | Production |
| `VITE_APP_NAME` | `Medical Insurance ML Dashboard` | All |
| `VITE_APP_VERSION` | `1.0.0` | All |

#### How to Add Environment Variables:

1. Go to your Vercel project dashboard
2. Click on **Settings** tab
3. Click on **Environment Variables** in the sidebar
4. Click **Add New**
5. Enter the variable name (e.g., `VITE_API_URL`)
6. Enter the value (e.g., `https://your-backend-url.onrender.com`)
7. Select environment: **Production** (or All Environments)
8. Click **Save**

### 4. Deploy

1. Click **Deploy** button
2. Wait for the build to complete
3. Your app will be available at `https://your-project-name.vercel.app`

## 🔧 Environment Variables Explained

### `VITE_API_URL`
- **Purpose**: Backend API endpoint
- **Example**: `https://medical-insurance-api.onrender.com`
- **Important**: Must match your Render backend URL exactly
- **Note**: Don't include trailing slash

### `VITE_APP_NAME`
- **Purpose**: Application display name
- **Example**: `Medical Insurance ML Dashboard`
- **Optional**: Used for branding

### `VITE_APP_VERSION`
- **Purpose**: Application version
- **Example**: `1.0.0`
- **Optional**: Used for version tracking

## 🔄 Automatic Deployments

Vercel will automatically deploy when you:
- Push to the `main` branch (Production)
- Create a pull request (Preview)

## 🌐 Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate provisioning

## 🐛 Troubleshooting

### Common Issues:

#### 1. Build Fails
```
Error: Environment variable "VITE_API_URL" references Secret "vite_api_url", which does not exist.
```
**Solution**: The `vercel.json` file has been fixed. Make sure you're using the updated version without secret references.

#### 2. API Connection Fails
```
Network Error or CORS Error
```
**Solution**: 
- Verify `VITE_API_URL` is set correctly
- Ensure backend is deployed and accessible
- Check backend CORS configuration includes your Vercel domain

#### 3. Environment Variables Not Working
**Solution**:
- Ensure variable names start with `VITE_`
- Redeploy after adding environment variables
- Check variable values don't have extra spaces

### Debugging Steps:

1. **Check Build Logs**:
   - Go to **Deployments** tab
   - Click on failed deployment
   - Review build logs for errors

2. **Test Environment Variables**:
   - Add `console.log(import.meta.env.VITE_API_URL)` to your code temporarily
   - Check browser console after deployment

3. **Verify API Connection**:
   - Test your backend URL directly in browser
   - Check if `/health` endpoint responds

## 📋 Deployment Checklist

- [ ] Repository connected to Vercel
- [ ] Build settings configured correctly
- [ ] `VITE_API_URL` environment variable set
- [ ] Backend deployed and accessible
- [ ] Backend CORS configured with Vercel domain
- [ ] Build completes successfully
- [ ] App loads without errors
- [ ] API calls work correctly

## 🔒 Security Notes

- Never commit environment variables to Git
- Use Vercel's environment variable system
- Keep API URLs secure
- Use HTTPS for all production URLs

## 📞 Support

If you encounter issues:

1. Check Vercel build logs
2. Verify all environment variables are set
3. Test backend API independently
4. Check browser console for errors
5. Review network requests in browser dev tools

## 🔄 Updates and Redeployment

To update your deployment:

1. **Code Changes**: Push to your repository (auto-deploys)
2. **Environment Variables**: Update in Vercel dashboard, then redeploy
3. **Manual Redeploy**: Go to Deployments → Click "Redeploy"

## 📊 Monitoring

Vercel provides:
- **Analytics**: Usage and performance metrics
- **Functions**: Serverless function logs
- **Speed Insights**: Core Web Vitals tracking
- **Real User Monitoring**: Performance data

Access these in your project dashboard under the respective tabs.
