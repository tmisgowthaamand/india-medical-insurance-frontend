import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import { 
  BarChart3, 
  Brain, 
  TrendingUp, 
  Settings, 
  LogOut, 
  User,
  Shield,
  Menu,
  X,
  Heart,
  Activity,
  FileText,
  Users,
  Stethoscope
} from 'lucide-react';
import toast from 'react-hot-toast';
import { CompactLogo } from './Logo';

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = localStorage.getItem('email');
  const isAdmin = authAPI.isAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    authAPI.logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: BarChart3,
      description: 'Overview & Analytics',
      color: 'blue'
    },
    {
      name: 'Prediction',
      path: '/prediction',
      icon: Brain,
      description: 'AI Claim Prediction',
      color: 'purple'
    },
    {
      name: 'Claims Analysis',
      path: '/claims-analysis',
      icon: TrendingUp,
      description: 'Claims Insights',
      color: 'green'
    },
  ];

  if (isAdmin) {
    navItems.push({
      name: 'Admin',
      path: '/admin',
      icon: Settings,
      description: 'System Management',
      color: 'red'
    });
  }

  const getColorClasses = (color, isActive) => {
    const colors = {
      blue: {
        active: 'bg-blue-50 text-blue-700 border-blue-500',
        inactive: 'hover:bg-blue-50 hover:text-blue-600',
        icon: isActive ? 'text-blue-600' : 'text-blue-400 group-hover:text-blue-500'
      },
      purple: {
        active: 'bg-purple-50 text-purple-700 border-purple-500',
        inactive: 'hover:bg-purple-50 hover:text-purple-600',
        icon: isActive ? 'text-purple-600' : 'text-purple-400 group-hover:text-purple-500'
      },
      green: {
        active: 'bg-green-50 text-green-700 border-green-500',
        inactive: 'hover:bg-green-50 hover:text-green-600',
        icon: isActive ? 'text-green-600' : 'text-green-400 group-hover:text-green-500'
      },
      red: {
        active: 'bg-red-50 text-red-700 border-red-500',
        inactive: 'hover:bg-red-50 hover:text-red-600',
        icon: isActive ? 'text-red-600' : 'text-red-400 group-hover:text-red-500'
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white p-3 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          {sidebarOpen ? (
            <X className="h-6 w-6 text-gray-600" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        w-72 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200
        fixed inset-y-0 left-0 z-40 shadow-2xl transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:shadow-none lg:flex lg:flex-col lg:h-full
      `}>
        
        {/* Logo */}
        <div className="flex items-center px-6 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-cyan-600">
          <CompactLogo className="text-white" />
          <div className="ml-4">
            <p className="text-blue-100 text-sm font-medium">AI Dashboard</p>
          </div>
        </div>

        {/* Medical Stats Banner */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-100">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <Heart className="h-5 w-5 text-red-500 mb-1" />
              <span className="text-xs text-gray-600">Health</span>
            </div>
            <div className="flex flex-col items-center">
              <Activity className="h-5 w-5 text-green-500 mb-1" />
              <span className="text-xs text-gray-600">Analytics</span>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="h-5 w-5 text-blue-500 mb-1" />
              <span className="text-xs text-gray-600">Security</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 mt-6 px-4 overflow-y-auto">
          {/* Debug indicator */}
          <div className="mb-4 p-2 bg-blue-100 rounded text-center text-sm text-blue-800 lg:block hidden">
            Navigation Menu
          </div>
          <div className="space-y-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const colorClasses = getColorClasses(item.color, isActive);
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => {
                    setSidebarOpen(false);
                    console.log(`Navigating to: ${item.path}`);
                  }}
                  className={`group flex items-center px-4 py-4 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-md animate-fade-in ${
                    isActive
                      ? `${colorClasses.active} shadow-lg border-l-4`
                      : `text-gray-600 hover:text-gray-900 hover:bg-gray-50 ${colorClasses.inactive}`
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                    isActive ? 'bg-white/50' : 'bg-gray-100 group-hover:bg-white'
                  } transition-all duration-200`}>
                    <Icon className={`h-5 w-5 ${colorClasses.icon}`} />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          {/* User Info */}
          <div className="flex items-center mb-4 px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {email}
              </p>
              {isAdmin && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-red-100 to-pink-100 text-red-800 mt-1">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin
                </span>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-red-600 hover:text-white bg-red-50 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg border border-red-200 hover:border-red-500"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </>
  );
};

export default NavBar;
