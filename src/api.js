import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  import.meta.env.VITE_API_BASE_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:8001' : 'https://india-medical-insurance-backend.onrender.com');

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
      if (!['/login', '/signup'].includes(currentPath)) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('email');
        localStorage.removeItem('is_admin');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth functions
export const authAPI = {
  login: async (email, password) => {
    console.log('API: Attempting login for:', email);
    console.log('API: Backend URL:', API_BASE_URL);
    
    const formData = new FormData();
    formData.append('username', email); // OAuth2 form expects 'username' field but we'll use email
    formData.append('password', password);
    
    try {
      const response = await api.post('/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 30000, // 30 second timeout
      });
      
      console.log('API: Login response received:', response.data);
      
      const { access_token, email: userEmail, is_admin } = response.data;
      
      if (!access_token) {
        throw new Error('No access token received from server');
      }
      
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('email', userEmail);
      localStorage.setItem('is_admin', is_admin);
      
      console.log('API: Login successful, token stored');
      return response.data;
      
    } catch (error) {
      console.error('API: Login error:', error);
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - server may be slow');
      }
      
      throw error;
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
    return localStorage.getItem('is_admin') === 'true';
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
    const response = await api.post('/predict', data);
    return response.data;
  }
};

// Admin API functions
export const adminAPI = {
  uploadDataset: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  retrainModel: async () => {
    const response = await api.post('/admin/retrain');
    return response.data;
  }
};

// Utility function to handle API errors
export const handleAPIError = (error, defaultMessage = 'An error occurred') => {
  const message = error.response?.data?.detail || error.message || defaultMessage;
  toast.error(message);
  console.error('API Error:', error);
};

export default api;
