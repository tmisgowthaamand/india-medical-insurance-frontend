import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  import.meta.env.VITE_API_BASE_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:8001' : 'https://your-backend-url.onrender.com');

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
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('email');
      localStorage.removeItem('is_admin');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth functions
export const authAPI = {
  login: async (email, password) => {
    const formData = new FormData();
    formData.append('username', email); // OAuth2 form expects 'username' field but we'll use email
    formData.append('password', password);
    
    const response = await api.post('/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    const { access_token, email: userEmail, is_admin } = response.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('email', userEmail);
    localStorage.setItem('is_admin', is_admin);
    
    return response.data;
  },

  signup: async (email, password) => {
    const response = await api.post('/signup', { email, password });
    return response.data;
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
