import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = () => {
  const location = useLocation();
  
  const pathMap = {
    '/dashboard': 'Dashboard',
    '/prediction': 'AI Prediction',
    '/claims-analysis': 'Claims Analysis',
    '/admin': 'Admin Panel'
  };

  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ name: 'Dashboard', path: '/dashboard', icon: Home }];
    
    if (location.pathname !== '/dashboard') {
      const currentPath = location.pathname;
      const currentName = pathMap[currentPath];
      if (currentName) {
        breadcrumbs.push({ name: currentName, path: currentPath });
      }
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumb on dashboard
  }

  return (
    <nav className="flex items-center space-x-2 text-sm mb-4 animate-fade-in">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.path} className="flex items-center space-x-2">
          {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
          
          {index === breadcrumbs.length - 1 ? (
            // Current page - not clickable
            <span className="flex items-center space-x-1 text-gray-600 font-medium">
              {breadcrumb.icon && <breadcrumb.icon className="h-4 w-4" />}
              <span>{breadcrumb.name}</span>
            </span>
          ) : (
            // Previous pages - clickable
            <Link
              to={breadcrumb.path}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors duration-200"
            >
              {breadcrumb.icon && <breadcrumb.icon className="h-4 w-4" />}
              <span>{breadcrumb.name}</span>
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
