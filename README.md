# Medical Insurance ML Dashboard - Frontend

This is the React frontend for the Medical Insurance ML Dashboard, built with Vite and designed to be deployed on Vercel.

## Features

- Modern React 18 with Hooks
- Responsive design with Tailwind CSS
- React Router for navigation
- Axios for API communication
- Recharts for data visualization
- Lucide React for icons
- Hot toast notifications
- JWT authentication
- Admin panel functionality

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

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── NavBar.jsx      # Navigation sidebar
│   ├── Breadcrumb.jsx  # Breadcrumb navigation
│   ├── ScrollToTop.jsx # Auto scroll to top
│   └── ScrollToTopButton.jsx # Manual scroll button
├── pages/              # Page components
│   ├── Login.jsx       # Login page
│   ├── Signup.jsx      # Registration page
│   ├── Dashboard.jsx   # Main dashboard
│   ├── Prediction.jsx  # ML prediction page
│   ├── ClaimsAnalysis.jsx # Claims analysis
│   └── Admin.jsx       # Admin panel
├── api.js              # API configuration
├── App.jsx             # Main app component
└── main.jsx            # Entry point
```

## Features

### Authentication
- JWT-based authentication
- Protected routes
- Admin role management
- Persistent login state

### Dashboard
- Statistics overview
- Data visualizations
- Model performance metrics
- Quick navigation

### ML Prediction
- Interactive prediction form
- Real-time results
- Confidence indicators
- Patient information management

### Claims Analysis
- Comprehensive data analysis
- Interactive charts
- Regional comparisons
- Risk assessment

### Admin Panel
- Dataset management
- Model retraining
- User management
- System monitoring

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Medical Theme**: Professional healthcare colors
- **Animations**: Smooth transitions and effects
- **Accessibility**: WCAG compliant components

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Automatic image and asset optimization
- **Caching**: Efficient browser caching strategies

## Support

For issues and questions, please check the main project documentation or create an issue in the repository.
