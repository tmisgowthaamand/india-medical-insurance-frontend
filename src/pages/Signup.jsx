import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, handleAPIError } from '../services/api';
import { Shield, Eye, EyeOff, UserPlus, Heart, Activity, Users, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Logo, { LogoVariant } from '../components/common/Logo';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
    });
    setLoading(false);
    toast.success('Form reset successfully');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Remove password length restriction - allow any password

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false);
        toast.error('Request timed out. Please try again.');
      }
    }, 15000); // 15 second timeout

    try {
      console.log('Attempting signup with:', formData.email);
      const response = await authAPI.signup(formData.email, formData.password);
      console.log('Signup response:', response);
      
      clearTimeout(timeoutId);
      toast.success('🎉 Account created successfully! Please login.');
      
      // Small delay to show success message
      setTimeout(() => {
        navigate('/login');
      }, 1000);
      
    } catch (error) {
      console.error('Signup error:', error);
      
      // Show specific error messages from backend
      if (error.response?.data?.detail) {
        // Backend provides specific error message
        toast.error(error.response.data.detail);
      } else if (error.message?.includes('Email already exists') || error.message?.includes('already exists')) {
        toast.error('❌ This email is already registered. Please use a different email or try logging in.');
      } else if (error.response?.status === 400) {
        toast.error('❌ Please check your email format and password requirements.');
      } else if (error.response?.status === 409) {
        toast.error('❌ Email already exists. Please use a different email address.');
      } else if (error.response?.status === 500) {
        toast.error('❌ Server error occurred. Please try again in a few minutes.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        toast.error('❌ Cannot connect to server. Please check if the backend is running.');
      } else if (error.message?.includes('Network Error')) {
        toast.error('❌ Network connection failed. Please check your internet connection.');
      } else {
        toast.error('❌ Signup failed. Please try again.');
      }
    } finally {
      clearTimeout(timeoutId);
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
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Left Side - Medical Background */}
      <div className="hidden lg:flex lg:flex-col lg:justify-center lg:items-center relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800">
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
          <CheckCircle className="absolute bottom-20 right-1/3 w-12 h-12 text-white/20 animate-pulse delay-1500" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-8 animate-fade-in">
          <div className="mb-8">
            {/* Medical Insurance Logo */}
            <div className="flex justify-center mb-6 animate-scale-in">
              <LogoVariant size="xl" showText={true} variant="medical" onDark={true} />
            </div>
            <h1 className="text-4xl font-bold mb-4 animate-slide-up">
              Join HealthGuard
            </h1>
            <h2 className="text-2xl font-light mb-6 animate-slide-up delay-200">
              Your Medical Insurance Partner
            </h2>
          </div>
          
          <div className="space-y-4 text-lg animate-slide-up delay-400">
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-6 h-6" />
              <span>Instant Access to Dashboard</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Activity className="w-6 h-6" />
              <span>AI-Powered Predictions</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Heart className="w-6 h-6" />
              <span>Secure Data Protection</span>
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

      {/* Right Side - Signup Form */}
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8 animate-slide-in-right">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center lg:hidden mb-6 animate-scale-in">
              <Logo size="large" showText={true} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 animate-fade-in">
              Create Account
            </h2>
            <p className="mt-2 text-gray-600 animate-fade-in delay-200">
              Join MediCare+ Insurance Platform
            </p>
          </div>

          {/* Signup Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-scale-in delay-300">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400 bg-gray-50 focus:bg-white"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="group relative">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400 bg-gray-50 focus:bg-white"
                    placeholder="Create any password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="group relative">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400 bg-gray-50 focus:bg-white"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <UserPlus className="w-5 h-5" />
                      <span>Create Account</span>
                    </div>
                  )}
                </button>

                {loading && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                  >
                    Cancel & Reset
                  </button>
                )}
              </div>

              <div className="text-center">
                <span className="text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-200"
                  >
                    Sign in here
                  </Link>
                </span>
              </div>
            </form>
          </div>

          {/* Terms */}
          <div className="text-center text-sm text-gray-500 animate-fade-in delay-500">
            <p>By creating an account, you agree to our terms of service</p>
          </div>

          {/* Debug Info */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm animate-fade-in delay-600">
            <h4 className="font-semibold text-emerald-800 mb-2">Signup Requirements:</h4>
            <div className="space-y-1 text-emerald-700">
              <p>• Valid email address format</p>
              <p>• Password can be any length (your choice)</p>
              <p>• Passwords must match</p>
              <p>• Email must not be already registered</p>
            </div>
            {loading && (
              <div className="mt-2 p-2 bg-blue-100 border border-blue-200 rounded text-blue-800">
                <p className="text-xs">If signup is taking too long, check your network connection or try refreshing the page.</p>
              </div>
            )}
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
              <p className="text-xs"><strong>Note:</strong> If you get "Email already exists" error, try logging in instead or use a different email address.</p>
            </div>
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

export default Signup;
