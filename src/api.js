import axios from 'axios';
import toast from 'react-hot-toast';

// Determine API base URL with better production detection
const isProduction = import.meta.env.PROD || window.location.hostname !== 'localhost';
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  import.meta.env.VITE_API_BASE_URL || 
  (isProduction ? 'https://india-medical-insurance-backend.onrender.com' : 'http://localhost:8001');

console.log('API Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  hostname: window.location.hostname,
  final_API_BASE_URL: API_BASE_URL
});

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Add network error handling
    if (!error.response) {
      error.code = 'NETWORK_ERROR';
      console.error('Network error - backend may be down:', error.message);
    }
    
    if (error.response?.status === 401) {
      // Only redirect to login if we're not already on login/signup pages
      const currentPath = window.location.pathname;
      
      // For admin routes, check if user is not admin (redirect to dashboard instead of login)
      if (currentPath === '/admin' && !authAPI.isAdmin()) {
        console.log('Non-admin user trying to access admin route, redirecting to dashboard');
        window.location.href = '/dashboard';
        return Promise.reject(error);
      }
      
      // For other 401 errors, redirect to login
      if (!['/login', '/signup'].includes(currentPath)) {
        console.log('Authentication failed, redirecting to login');
        localStorage.removeItem('access_token');
        localStorage.removeItem('email');
        localStorage.removeItem('is_admin');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email, password) => {
    console.log('API: Attempting login for:', email);
    console.log('API: Backend URL:', API_BASE_URL);
    
    // Check for demo/admin accounts first (offline mode)
    const demoAccounts = {
      'admin@example.com': { password: 'admin123', is_admin: true },
      'admin@gmail.com': { password: 'admin123', is_admin: true },
      'gokrishna98@gmail.com': { password: 'admin123', is_admin: false },
      'user@example.com': { password: 'user123', is_admin: false }
    };
    
    if (demoAccounts[email] && demoAccounts[email].password === password) {
      console.log('API: Using demo account login');
      const mockResponse = {
        access_token: `demo_token_${Date.now()}`,
        email: email,
        is_admin: demoAccounts[email].is_admin,
        token_type: 'bearer'
      };
      
      // Store authentication data
      localStorage.setItem('access_token', mockResponse.access_token);
      localStorage.setItem('email', mockResponse.email);
      localStorage.setItem('is_admin', mockResponse.is_admin);
      
      console.log('API: Demo login successful, token stored');
      return mockResponse;
    }
    
    // Use URLSearchParams for proper form encoding
    const formData = new URLSearchParams();
    formData.append('username', email); // OAuth2 form expects 'username' field but we'll use email
    formData.append('password', password);
    
    try {
      const response = await api.post('/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 10000, // Reduced to 10 second timeout
      });
      
      console.log('API: Login response received:', response.data);
      
      if (response.data && response.data.access_token) {
        // Store authentication data
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('is_admin', response.data.is_admin);
        
        console.log('API: Login successful, token stored');
        return response.data;
      } else {
        console.error('API: No access token in response:', response.data);
        throw new Error('No access token received from server');
      }
    } catch (error) {
      console.error('API: Login error:', error);
      console.error('API: Error details:', error.response?.data || error.message);
      
      // If backend is down, suggest demo accounts
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout') || 
          error.message.includes('Network Error') || !error.response ||
          error.response?.status === 504) {
        throw new Error('Backend unavailable. Try demo accounts: admin@example.com / admin123 or admin@gmail.com / admin123');
      } else if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(error.response?.data?.detail || 'Login failed. Please try again.');
      }
    }
  },
  signup: async (email, password) => {
    console.log('API: Attempting signup for:', email);
    console.log('API: Backend URL:', API_BASE_URL);
    
    try {
      const response = await api.post('/signup', { 
        email: email.trim(), 
        password: password 
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      });
      
      console.log('API: Signup response received:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('API: Signup error:', error);
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - server may be slow');
      }
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        const message = error.response.data?.detail || error.response.data?.message || 'Invalid signup data';
        console.log('Backend error detail:', message);
        console.log('Full error response:', error.response.data);
        throw new Error(message);
      }
      
      if (error.response?.status === 409) {
        throw new Error('Email already exists. Please use a different email.');
      }
      
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('email');
    localStorage.removeItem('is_admin');
  },

  getCurrentUser: async () => {
    const response = await api.get('/me');
    return response.data;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },

  isAdmin: () => {
    const isAdmin = localStorage.getItem('is_admin') === 'true';
    console.log('Admin check:', {
      is_admin_value: localStorage.getItem('is_admin'),
      is_admin_boolean: isAdmin,
      email: localStorage.getItem('email'),
      has_token: !!localStorage.getItem('access_token')
    });
    return isAdmin;
  },

  // Debug function to check authentication status
  debugAuth: () => {
    const authData = {
      access_token: localStorage.getItem('access_token'),
      email: localStorage.getItem('email'),
      is_admin: localStorage.getItem('is_admin'),
      isAuthenticated: !!localStorage.getItem('access_token'),
      isAdmin: localStorage.getItem('is_admin') === 'true'
    };
    console.log('Authentication Debug:', authData);
    return authData;
  },

  // Force admin status (for testing)
  setAdminStatus: (isAdmin) => {
    localStorage.setItem('is_admin', isAdmin.toString());
    console.log('Admin status set to:', isAdmin);
  }
};

// Dashboard API functions
export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get('/stats');
    return response.data;
  },

  getClaimsAnalysis: async () => {
    const response = await api.get('/claims-analysis');
    return response.data;
  },

  getModelInfo: async () => {
    const response = await api.get('/model-info');
    return response.data;
  }
};

// Prediction API functions
export const predictionAPI = {
  predict: async (data) => {
    try {
      const response = await api.post('/predict', data, { timeout: 10000 });
      return response.data;
    } catch (error) {
      console.log('Prediction API unavailable, using mock prediction');
      
      // Mock prediction calculation based on input data
      const { age, bmi, gender, smoker, region, premium_annual_inr } = data;
      
      // Simple mock calculation
      let baseClaim = 15000;
      
      // Age factor
      if (age > 50) baseClaim *= 1.5;
      else if (age > 35) baseClaim *= 1.2;
      
      // BMI factor
      if (bmi > 30) baseClaim *= 1.3;
      else if (bmi < 18.5) baseClaim *= 1.1;
      
      // Smoker factor
      if (smoker === 'Yes') baseClaim *= 1.8;
      
      // Region factor
      const regionMultipliers = { 'North': 1.1, 'South': 0.9, 'East': 0.95, 'West': 1.15 };
      baseClaim *= regionMultipliers[region] || 1.0;
      
      // Premium factor
      baseClaim *= (premium_annual_inr / 25000);
      
      // Add some randomness
      baseClaim *= (0.8 + Math.random() * 0.4);
      
      const prediction = Math.round(baseClaim);
      const confidence = Math.min(0.95, Math.max(0.65, 0.85 + (Math.random() - 0.5) * 0.2));
      
      return {
        prediction: prediction,
        confidence: confidence,
        input_data: data,
        mock: true
      };
    }
  },
};

// Admin API functions
export const adminAPI = {
  uploadDataset: async (file) => {
    try {
      console.log('Attempting to upload dataset:', file.name);
      
      // Check if user is admin before making the request
      if (!authAPI.isAdmin()) {
        throw new Error('Admin access required for dataset upload');
      }
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout for file uploads
      });
      
      console.log('Upload successful:', response.data);
      return response.data;
    } catch (error) {
      console.log('Upload error:', error.message);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please login as admin.');
      } else if (error.response?.status === 403) {
        throw new Error('Admin access required for dataset upload.');
      } else if (error.message.includes('Admin access required')) {
        throw error; // Re-throw admin access error
      } else {
        console.log('Upload API unavailable, simulating upload');
        
        // Mock response for when backend is unavailable
        return {
          success: true,
          message: `Demo: File "${file.name}" upload simulated successfully! Backend unavailable - this is a demo response.`,
          filename: file.name,
          size: file.size,
          mock: true
        };
      }
    }
  },

  retrainModel: async () => {
    try {
      console.log('Attempting to retrain model');
      
      // Check if user is admin before making the request
      if (!authAPI.isAdmin()) {
        throw new Error('Admin access required for model retraining');
      }
      
      const response = await api.post('/admin/retrain', {}, { timeout: 60000 }); // 60 second timeout for retraining
      
      console.log('Retrain successful:', response.data);
      return response.data;
    } catch (error) {
      console.log('Retrain error:', error.message);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please login as admin.');
      } else if (error.response?.status === 403) {
        throw new Error('Admin access required for model retraining.');
      } else if (error.message.includes('Admin access required')) {
        throw error; // Re-throw admin access error
      } else {
        console.log('Retrain API unavailable, simulating retraining');
        
        // Mock response for when backend is unavailable
        return {
          success: true,
          message: 'Demo: Model retraining simulated successfully! Backend unavailable - this is a demo response.',
          mock: true,
          training_time: '2-3 minutes (simulated)',
          new_accuracy: 0.93
        };
      }
    }
  }
};

// Utility function to handle API errors
export const handleAPIError = (error, defaultMessage = 'An error occurred') => {
  const message = error.response?.data?.detail || error.message || defaultMessage;
  toast.error(message);
  console.error('API Error:', error);
};

export default api;
