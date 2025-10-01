import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, handleAPIError } from '../services/api';
import { Shield, Eye, EyeOff, LogIn, Heart, Activity, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import Logo, { LogoVariant } from '../components/common/Logo';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting login with:', formData.email);
      const response = await authAPI.login(formData.email, formData.password);
      console.log('Login response:', response);
      
      toast.success('Welcome back! Login successful!');
      
      // Small delay to show success message
      setTimeout(() => {
        console.log('Redirecting to dashboard...');
        navigate('/dashboard');
      }, 500);
      
    } catch (error) {
      console.error('Login error:', error);
      
      // More specific error handling
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        toast.error('Connection timeout. The server may be slow. Please try again.');
      } else if (error.response?.status === 401) {
        toast.error('Invalid email or password. Please try again.');
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please try again later.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        toast.error('Cannot connect to server. Please check if the backend is running.');
      } else if (error.message?.includes('Network Error')) {
        toast.error('Network connection failed. Please check your internet connection.');
      } else {
        handleAPIError(error, 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  // Redirect if already authenticated
  React.useEffect(() => {
    if (authAPI.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Left Side - Medical Background */}
      <div className="hidden lg:flex lg:flex-col lg:justify-center lg:items-center relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-800">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-12 h-12 bg-white rounded-full animate-pulse delay-2000"></div>
          <div className="absolute bottom-40 right-10 w-24 h-24 bg-white rounded-full animate-pulse delay-500"></div>
        </div>
        
        {/* Medical Icons Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <Heart className="absolute top-20 left-1/4 w-8 h-8 text-white/20 animate-bounce delay-300" />
          <Activity className="absolute top-1/3 right-1/4 w-10 h-10 text-white/20 animate-pulse delay-700" />
          <Users className="absolute bottom-1/3 left-1/3 w-6 h-6 text-white/20 animate-bounce delay-1000" />
          <Shield className="absolute bottom-20 right-1/3 w-12 h-12 text-white/20 animate-pulse delay-1500" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-8 animate-fade-in">
          <div className="mb-8">
            {/* Medical Insurance Logo */}
            <div className="flex justify-center mb-6 animate-scale-in">
              <LogoVariant size="xl" showText={true} variant="professional" onDark={true} />
            </div>
            <h1 className="text-4xl font-bold mb-4 animate-slide-up">
              Welcome to HealthGuard
            </h1>
            <h2 className="text-2xl font-light mb-6 animate-slide-up delay-200">
              AI-Powered Medical Insurance
            </h2>
          </div>
          
          <div className="space-y-4 text-lg animate-slide-up delay-400">
            <div className="flex items-center justify-center space-x-3">
              <Activity className="w-6 h-6" />
              <span>Smart Claim Predictions</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Heart className="w-6 h-6" />
              <span>Health Risk Analysis</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Users className="w-6 h-6" />
              <span>Policy Management</span>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-float"></div>
          <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-white rounded-full animate-float delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white rounded-full animate-float delay-2000"></div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8 animate-slide-in-right">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center lg:hidden mb-6 animate-scale-in">
              <Logo size="large" showText={true} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 animate-fade-in">
              Welcome Back
            </h2>
            <p className="mt-2 text-gray-600 animate-fade-in delay-200">
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-scale-in delay-300">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </div>
                )}
              </button>

              <div className="text-center">
                <span className="text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                  >
                    Sign up here
                  </Link>
                </span>
              </div>
            </form>
          </div>

          {/* Features */}
          <div className="text-center text-sm text-gray-500 animate-fade-in delay-500">
            <p>Secure • AI-Powered • Real-time Analytics</p>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slide-in-right {
          from { 
            opacity: 0; 
            transform: translateX(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        @keyframes scale-in {
          from { 
            opacity: 0; 
            transform: scale(0.9); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.8s ease-out; }
        .animate-scale-in { animation: scale-in 0.6s ease-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-1000 { animation-delay: 1s; }
        .delay-1500 { animation-delay: 1.5s; }
        .delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

export default Login;
