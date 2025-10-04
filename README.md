# MediCare+ Frontend 🏥

**AI-Powered Medical Insurance Dashboard - Frontend Application**

A modern, responsive React application for medical insurance claim prediction and analysis, featuring advanced AI/ML capabilities and professional healthcare UI/UX design.

## 🚀 Project Status: **COMPLETED** ✅

This is a fully functional, production-ready frontend application built with React 18, Vite, and Tailwind CSS.

## ✨ Key Features

### 🔐 Authentication & Security
- JWT-based secure authentication
- Protected routes with role-based access
- Admin panel with elevated permissions
- Persistent login state management

### 🤖 AI/ML Integration
- Real-time insurance claim prediction
- BMI analysis with health risk assessment
- Interactive prediction forms with validation
- Confidence indicators and risk analysis

### 📊 Advanced Analytics
- Comprehensive claims analysis dashboard
- Interactive data visualizations with Recharts
- Regional and demographic analysis
- Statistical insights and trends

### 💌 Email Functionality
- Professional HTML email templates
- Prediction report delivery via Gmail SMTP
- Email validation and delivery confirmation
- Bulletproof email service integration

### 🎨 Modern UI/UX
- Professional medical insurance branding
- Responsive design (mobile-first approach)
- Loading screens with animations
- Toast notifications and user feedback
- Accessibility-compliant components

## Deployment on Vercel

### Prerequisites

1. A Vercel account
2. Backend API deployed on Render
3. Environment variables configured

### Environment Variables

Set these environment variables in your Vercel project:

```
VITE_API_URL=https://your-backend-url.onrender.com
VITE_APP_NAME=Medical Insurance ML Dashboard
VITE_APP_VERSION=1.0.0
```

### Deployment Steps

1. **Connect Repository**: Connect your GitHub repository to Vercel
2. **Configure Build Settings**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
3. **Set Environment Variables**: Add all required environment variables
4. **Deploy**: Vercel will automatically deploy your application

### Automatic Deployments

Vercel will automatically deploy:
- **Production**: When you push to the `main` branch
- **Preview**: When you create a pull request

### Custom Domain

You can add a custom domain in your Vercel project settings.

## Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set Environment Variables**:
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

5. **Preview Production Build**:
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
src/
├── components/              # Reusable UI Components
│   ├── NavBar.jsx          # Responsive navigation sidebar
│   ├── Logo.jsx            # MediCare+ branding components
│   ├── LoadingScreen.jsx   # YouTube-style loading screen
│   ├── AppLoader.jsx       # Application loader wrapper
│   ├── PageLoader.jsx      # Page-specific loading states
│   ├── Breadcrumb.jsx      # Navigation breadcrumbs
│   ├── ScrollToTop.jsx     # Auto scroll functionality
│   └── ScrollToTopButton.jsx # Manual scroll button
├── pages/                  # Main Application Pages
│   ├── Login.jsx           # User authentication
│   ├── Signup.jsx          # User registration
│   ├── Dashboard.jsx       # Main analytics dashboard
│   ├── Prediction.jsx      # AI prediction interface
│   ├── ClaimsAnalysis.jsx  # Advanced claims analysis
│   └── Admin.jsx           # Administrative panel
├── services/               # API & External Services
│   └── api.js              # Axios configuration & endpoints
├── hooks/                  # Custom React Hooks
│   └── useDocumentTitle.js # Dynamic page titles
├── context/                # React Context Providers
│   └── TitleProvider.jsx   # Title management context
├── App.jsx                 # Main application component
└── main.jsx                # Application entry point
```

## 🎯 Core Application Pages

### 🏠 **Dashboard**
- Real-time statistics and KPIs
- Interactive data visualizations
- Model performance metrics
- Quick action navigation
- Professional medical branding

### 🔮 **AI Prediction**
- Interactive patient information form
- Real-time BMI calculation and analysis
- Health risk assessment with visual indicators
- Instant claim amount predictions
- Email report delivery functionality
- Outlier detection and warnings

### 📈 **Claims Analysis**
- Comprehensive dataset analytics
- Age group and regional analysis
- Smoking impact visualization
- Interactive charts and graphs
- Statistical insights and trends

### ⚙️ **Admin Panel**
- Dataset management and upload
- ML model retraining capabilities
- System health monitoring
- User management tools
- API status tracking

## 🎨 Technology Stack

### **Frontend Framework**
- **React 18** - Latest React with Hooks and Concurrent Features
- **Vite** - Lightning-fast build tool and dev server
- **React Router** - Client-side routing and navigation

### **Styling & UI**
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **Responsive Design** - Mobile-first approach
- **Medical Theme** - Professional healthcare color palette

### **Data Visualization**
- **Recharts** - Composable charting library
- **Interactive Charts** - Real-time data visualization
- **Statistical Dashboards** - Advanced analytics display

### **State Management & API**
- **Axios** - HTTP client with interceptors
- **React Hot Toast** - Beautiful notification system
- **JWT Authentication** - Secure token-based auth

## 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## ⚡ Performance Features

- **Code Splitting** - Automatic route-based splitting
- **Tree Shaking** - Unused code elimination
- **Asset Optimization** - Automatic image and asset optimization
- **Caching** - Efficient browser caching strategies
- **Lazy Loading** - Components loaded on demand

## 🏆 Project Achievements

✅ **Complete AI/ML Integration** - Real-time prediction capabilities  
✅ **Professional UI/UX** - Medical insurance industry standards  
✅ **Email Functionality** - Bulletproof email delivery system  
✅ **Admin Panel** - Full administrative capabilities  
✅ **Responsive Design** - Works on all devices  
✅ **Production Ready** - Deployed and tested  
✅ **Security Implemented** - JWT authentication and protected routes  
✅ **Performance Optimized** - Fast loading and smooth interactions  

## 📞 Support

This is a completed project. For technical details, refer to the main project documentation or examine the well-documented source code.
