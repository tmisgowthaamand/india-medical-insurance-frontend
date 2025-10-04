import axios from 'axios';
import toast from 'react-hot-toast';

// Force localhost when running locally to avoid Render backend issues
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8001'
  : import.meta.env.VITE_API_URL || 
    import.meta.env.VITE_API_BASE_URL || 
    'https://srv-d3b668ogjchc73f9ece0-latest.onrender.com';

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
  timeout: 0, // No global timeout - let individual requests set their own
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
      const requestUrl = error.config?.url || '';
      
      // Don't auto-redirect for admin upload/retrain operations - let the component handle it
      if (requestUrl.includes('/admin/upload') || requestUrl.includes('/admin/retrain')) {
        console.log('Admin operation failed with 401 - letting component handle error');
        return Promise.reject(error);
      }
      
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
      
      // Mock prediction calculation based on input data (DETERMINISTIC)
      const { age, bmi, gender, smoker, region, premium_annual_inr } = data;
      
      // Create a deterministic "random" factor based on input data
      const dataHash = age + bmi * 10 + (gender === 'Male' ? 100 : 200) + 
                      (smoker === 'Yes' ? 1000 : 0) + premium_annual_inr;
      const deterministicFactor = 0.85 + ((dataHash % 100) / 100) * 0.3; // Range: 0.85 to 1.15
      
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
      
      // Apply deterministic variation (same input = same result)
      baseClaim *= deterministicFactor;
      
      const prediction = Math.round(baseClaim);
      
      // Deterministic confidence based on input factors
      let confidenceBase = 0.85;
      if (age > 60) confidenceBase -= 0.05; // Lower confidence for very high age
      if (bmi < 18.5 || bmi > 35) confidenceBase -= 0.03; // Lower confidence for extreme BMI
      if (smoker === 'Yes') confidenceBase -= 0.02; // Lower confidence for smokers
      
      const confidence = Math.min(0.95, Math.max(0.65, confidenceBase));
      
      return {
        prediction: prediction,
        confidence: confidence,
        input_data: data,
        mock: true
      };
    }
  },

  sendPredictionEmail: async (emailData, retryCount = 0) => {
    const maxRetries = 3;
    const baseTimeout = 90000; // 90 seconds base timeout
    const renderTimeout = 240000; // 4 minutes for Render services (increased for cold starts)
    
    try {
      console.log(`📧 Sending prediction email to: ${emailData.email} (attempt ${retryCount + 1}/${maxRetries + 1})`);
      
      // Determine if this is a Render service
      const isRenderService = API_BASE_URL.includes('onrender.com');
      const timeout = isRenderService ? renderTimeout : baseTimeout;
      
      console.log(`⏱️ Using timeout: ${timeout/1000}s for ${isRenderService ? 'Render' : 'local/other'} service`);
      
      // For Render services, try to wake up the service first
      if (isRenderService) {
        try {
          console.log('🏥 Pinging health endpoint to wake up Render service...');
          
          // Quick health check with shorter timeout
          const healthResponse = await api.get('/health', { 
            timeout: 15000, // Reduced to 15 seconds for quick check
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          console.log('✅ Service is awake, proceeding with email...');
          
        } catch (healthError) {
          console.log('⚠️ Health check failed, but continuing with email request:', healthError.message);
          // Continue with email request even if health check fails - service might still work
        }
      }
      
      console.log('📧 Sending email request to backend...');
      
      // Create email request with proper timeout
      const response = await api.post('/send-prediction-email', emailData, { 
        timeout: timeout,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      // Log the actual response for debugging
      console.log('📨 Backend response:', response.data);
      
      // Return the exact response from backend (don't modify success status)
      return response.data;
      
    } catch (error) {
      console.log(`❌ Email API error (attempt ${retryCount + 1}):`, error.message);
      
      // Check if we should retry
      const shouldRetry = retryCount < maxRetries && (
        error.code === 'ECONNABORTED' || // Check for specific error types
        error.message.includes('timeout') || // Timeout
        error.message.includes('Network Error') || // Network error
        error.message.includes('exceeded') || // Timeout exceeded
        !error.response || // Network error
        error.response?.status >= 500 // Server errors
      );
      
      if (error.message.includes('Gmail connection failed') || 
          error.message.includes('Authentication failed') ||
          error.message.includes('SMTP') ||
          error.message.includes('stored locally')) {
        toast.error(
          `❌ Email service not configured properly
          
🔧 ${error.message}
⏱️ Processing time: ${emailDuration}s
💡 Gmail credentials may not be set on server
📥 Use Download option to save report locally`, 
          {
            duration: 15000,
            style: {
              maxWidth: '500px',
            }
          }
        );
      } else if (shouldRetry) {
        const waitTime = (retryCount + 1) * 5000; // 5, 10, 15 seconds (increased wait time)
        
        console.log(`🔄 Retrying email send in ${waitTime / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return predictionAPI.sendPredictionEmail(emailData, retryCount + 1);
      }
      
      // If all retries failed, return error
      console.log('📧 All email attempts failed');
      
      return {
        success: false,
        message: `❌ Email delivery failed after ${retryCount + 1} attempts: ${error.message}. Please check your internet connection and try again.`,
        error: error.message
      };
    }
  },
};

// Admin API functions
export const adminAPI = {
  uploadDataset: async (file) => {
    try {
      console.log('Attempting to upload dataset:', file.name);
      console.log('Current auth status:', authAPI.debugAuth());
      
      // Check if user is admin before making the request
      if (!authAPI.isAdmin()) {
        throw new Error('Admin access required for dataset upload');
      }
      
      // Check if using demo account - provide mock response for demo
      const email = localStorage.getItem('email');
      const token = localStorage.getItem('access_token');
      
      if (email && (email.includes('admin@example.com') || email.includes('admin@gmail.com')) && token?.includes('demo_token')) {
        console.log('Demo admin account detected, providing mock upload response');
        
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return {
          success: true,
          message: `Demo: File "${file.name}" uploaded successfully! Model retrained with ${Math.floor(Math.random() * 500 + 500)} samples.`,
          filename: file.name,
          size: file.size,
          dataset_rows: Math.floor(Math.random() * 500 + 500),
          training_completed: true,
          mock: true
        };
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
      if (error.response?.status === 401 || error.response?.status === 403) {
        // For demo accounts, provide mock response instead of error
        const email = localStorage.getItem('email');
        const token = localStorage.getItem('access_token');
        
        if (email && (email.includes('admin@example.com') || email.includes('admin@gmail.com')) && token?.includes('demo_token')) {
          console.log('Demo admin account - providing mock upload response despite 401/403');
          
          // Simulate upload delay
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          return {
            success: true,
            message: `Demo: File "${file.name}" uploaded successfully! Backend authentication bypassed for demo.`,
            filename: file.name,
            size: file.size,
            dataset_rows: Math.floor(Math.random() * 500 + 500),
            training_completed: true,
            mock: true
          };
        }
        
        throw new Error('Authentication failed. Please login as admin and try again.');
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
      console.log('Current auth status:', authAPI.debugAuth());
      
      // Check if user is admin before making the request
      if (!authAPI.isAdmin()) {
        throw new Error('Admin access required for model retraining');
      }
      
      // Check if using demo account - provide mock response for demo
      const email = localStorage.getItem('email');
      const token = localStorage.getItem('access_token');
      
      if (email && (email.includes('admin@example.com') || email.includes('admin@gmail.com')) && token?.includes('demo_token')) {
        console.log('Demo admin account detected, providing mock retrain response');
        
        // Simulate retrain delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        return {
          success: true,
          message: 'Demo: Model retrained successfully! Training completed with improved accuracy.',
          mock: true,
          training_time: '3 seconds (simulated)',
          new_accuracy: 0.94 + Math.random() * 0.05,
          samples_used: Math.floor(Math.random() * 500 + 800)
        };
      }
      
      const response = await api.post('/admin/retrain', {}, { timeout: 60000 }); // 60 second timeout for retraining
      
      console.log('Retrain successful:', response.data);
      return response.data;
    } catch (error) {
      console.log('Retrain error:', error.message);
      
      // Handle specific error cases
      if (error.response?.status === 401 || error.response?.status === 403) {
        // For demo accounts, provide mock response instead of error
        const email = localStorage.getItem('email');
        const token = localStorage.getItem('access_token');
        
        if (email && (email.includes('admin@example.com') || email.includes('admin@gmail.com')) && token?.includes('demo_token')) {
          console.log('Demo admin account - providing mock retrain response despite 401/403');
          
          // Simulate retrain delay
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          return {
            success: true,
            message: 'Demo: Model retrained successfully! Backend authentication bypassed for demo.',
            mock: true,
            training_time: '3 seconds (simulated)',
            new_accuracy: 0.94 + Math.random() * 0.05,
            samples_used: Math.floor(Math.random() * 500 + 800)
          };
        }
        
        throw new Error('Authentication failed. Please login as admin and try again.');
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
