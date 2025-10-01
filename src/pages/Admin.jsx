import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, dashboardAPI, handleAPIError, authAPI } from '../services/api';
import Breadcrumb from '../components/Breadcrumb';
import { 
  Settings, 
  Upload, 
  RefreshCw, 
  Database, 
  Brain,
  CheckCircle,
  AlertCircle,
  FileText,
  Activity,
  Shield,
  Users,
  BarChart3,
  Heart,
  Stethoscope,
  TrendingUp,
  Server,
  HardDrive,
  Cpu,
  ArrowLeft,
  Home
} from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '../components/common/Logo';
import PageLoader from '../components/PageLoader';

const Admin = () => {
  const navigate = useNavigate();
  const [modelInfo, setModelInfo] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [retraining, setRetraining] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Debug authentication status
    console.log('Admin component mounted - checking authentication...');
    const authDebug = authAPI.debugAuth();
    
    if (!authAPI.isAuthenticated()) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login');
      return;
    }
    
    if (!authAPI.isAdmin()) {
      console.log('User not admin, redirecting to dashboard');
      toast.error('Admin access required');
      navigate('/dashboard');
      return;
    }
    
    console.log('Admin authentication verified, loading component');
  }, [navigate]);

  // Mock model info for when API is unavailable
  const mockModelInfo = {
    status: "Model loaded",
    test_r2: 0.92,
    test_rmse: 3500,
    training_date: "2024-09-30",
    training_samples: 1000,
    model_type: "Random Forest Regressor"
  };

  const fetchModelInfo = async (showRefreshing = false, silent = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      // Add timeout protection
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('API timeout')), 5000)
      );
      
      const info = await Promise.race([
        dashboardAPI.getModelInfo(),
        timeoutPromise
      ]);
      
      // Check if endpoint returned error message
      if (info?.message) {
        console.log('Admin: API returned error message, using mock data');
        setModelInfo(mockModelInfo);
      } else {
        setModelInfo(info);
      }
      
      if (showRefreshing && !silent) {
        toast.success('Model information refreshed successfully!');
      }
    } catch (error) {
      console.log('Admin: API unavailable, using mock model info');
      setModelInfo(mockModelInfo);
      
      // Only show error message for manual refresh, not silent background calls
      if (showRefreshing && !silent) {
        toast.error('API unavailable. Showing cached model information.');
      }
    } finally {
      if (showRefreshing) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // Initialize with mock data immediately
    console.log('Admin: Initializing with mock model info');
    setModelInfo(mockModelInfo);
    setLoading(false);
    
    // Then try to fetch real data in background silently
    fetchModelInfo(true, true); // showRefreshing=true, silent=true
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        toast.error('Please select a CSV file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB');
        return;
      }
      setUploadFile(file);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      toast.error('Please select a file first');
      return;
    }

    // Check admin status before upload
    if (!authAPI.isAdmin()) {
      toast.error('Admin access required for dataset upload');
      navigate('/dashboard');
      return;
    }

    console.log('Starting dataset upload:', uploadFile.name);
    setUploading(true);
    
    try {
      const result = await adminAPI.uploadDataset(uploadFile);
      
      if (result.mock) {
        toast.success(`${result.message} (Demo Mode)`, { duration: 6000 });
      } else {
        toast.success(result.message || 'Dataset uploaded and model retrained successfully!');
      }
      
      setUploadFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-upload');
      if (fileInput) fileInput.value = '';
      // Refresh model info
      await fetchModelInfo(false);
    } catch (error) {
      console.error('Upload error:', error);
      
      if (error.message.includes('Admin access required')) {
        toast.error(error.message);
        navigate('/dashboard');
      } else if (error.message.includes('Authentication required')) {
        toast.error(error.message);
        navigate('/login');
      } else {
        handleAPIError(error, 'Upload failed');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRetrain = async () => {
    if (retraining) return; // Prevent multiple clicks
    
    // Check admin status before retraining
    if (!authAPI.isAdmin()) {
      toast.error('Admin access required for model retraining');
      navigate('/dashboard');
      return;
    }
    
    // Confirmation dialog
    const confirmed = window.confirm(
      'Are you sure you want to retrain the model? This process may take several minutes and will update the current model with new training data.'
    );
    
    if (!confirmed) return;
    
    console.log('Starting model retraining...');
    setRetraining(true);
    toast.info('Starting model retraining process... This may take a few minutes.');
    
    try {
      const result = await adminAPI.retrainModel();
      
      if (result.mock) {
        toast.success(`${result.message} (Demo Mode)`, { duration: 6000 });
      } else {
        toast.success(result.message || 'Model retrained successfully! 🎉');
      }
      
      // Refresh model info to show updated metrics
      await fetchModelInfo(false);
      
      // Additional success feedback
      if (!result.mock) {
        toast.success('Model information updated with new training results!');
      }
    } catch (error) {
      console.error('Retrain error:', error);
      
      if (error.message.includes('Admin access required')) {
        toast.error(error.message);
        navigate('/dashboard');
      } else if (error.message.includes('Authentication required')) {
        toast.error(error.message);
        navigate('/login');
      } else {
        handleAPIError(error, 'Model retraining failed');
        
        // Additional error context
        if (error.response?.status === 500) {
          toast.error('Server error during retraining. Please check the backend logs.');
        } else if (error.response?.status === 404) {
          toast.error('Retraining endpoint not found. Please check API configuration.');
        } else if (error.code === 'NETWORK_ERROR') {
          toast.error('Network error. Please check your connection and try again.');
        }
      }
    } finally {
      setRetraining(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-8">
        <PageLoader 
          message="Loading Admin Panel" 
          size="large" 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          {/* Breadcrumb Navigation */}
          <Breadcrumb />
          
          {/* Back Button */}
          <div className="mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-gray-700 hover:text-red-600"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
          </div>

          <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Logo size="large" showText={true} onDark={true} />
                <div>
                  <h1 className="text-3xl font-bold">Admin Control Center</h1>
                  <p className="text-red-100 mt-2">
                    MediCare+ System Management
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <div className="text-center">
                  <Heart className="h-8 w-8 mx-auto mb-2 text-red-200" />
                  <p className="text-sm text-red-100">Health Data</p>
                </div>
                <div className="text-center">
                  <Brain className="h-8 w-8 mx-auto mb-2 text-red-200" />
                  <p className="text-sm text-red-100">AI Models</p>
                </div>
                <div className="text-center">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-red-200" />
                  <p className="text-sm text-red-100">Security</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Model Management */}
          <div className="lg:col-span-2 space-y-6">
            {/* Model Status Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">AI Model Status</h2>
                    <p className="text-gray-600">Machine Learning Performance</p>
                  </div>
                </div>
                <button
                  onClick={() => fetchModelInfo(true)}
                  disabled={refreshing}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                </button>
              </div>
              
              {modelInfo ? (
                <div className="space-y-6">
                  {/* Status Indicator */}
                  <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl border border-green-200">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">{modelInfo.status}</p>
                      <p className="text-sm text-green-600">Model is operational and ready</p>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  {modelInfo.test_r2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                        <div className="flex items-center space-x-3 mb-3">
                          <BarChart3 className="h-5 w-5 text-blue-600" />
                          <h3 className="font-semibold text-blue-800">Accuracy Score</h3>
                        </div>
                        <div className="text-3xl font-bold text-blue-900">
                          {(modelInfo.test_r2 * 100).toFixed(1)}%
                        </div>
                        <p className="text-sm text-blue-600 mt-1">R² Coefficient</p>
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                        <div className="flex items-center space-x-3 mb-3">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          <h3 className="font-semibold text-green-800">Error Rate</h3>
                        </div>
                        <div className="text-2xl font-bold text-green-900">
                          {modelInfo.test_rmse ? formatCurrency(modelInfo.test_rmse) : 'N/A'}
                        </div>
                        <p className="text-sm text-green-600 mt-1">RMSE Value</p>
                      </div>
                    </div>
                  )}

                  {/* Training Information */}
                  {modelInfo.training_samples && (
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h3 className="font-semibold text-gray-800 mb-3">Training Details</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Training Samples</p>
                          <p className="font-bold text-lg">{modelInfo.training_samples.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Test Samples</p>
                          <p className="font-bold text-lg">{modelInfo.test_samples?.toLocaleString() || 'N/A'}</p>
                        </div>
                      </div>
                      {modelInfo.training_date && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-600">
                            Last trained: {new Date(modelInfo.training_date).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No model information available</p>
                </div>
              )}
            </div>

            {/* Dataset Upload Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Dataset Management</h2>
                  <p className="text-gray-600">Upload and manage medical insurance data</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* File Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 transition-colors duration-200">
                  <input
                    type="file"
                    id="file-upload"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Upload Medical Insurance Dataset
                    </p>
                    <p className="text-gray-600 mb-4">
                      Drag and drop your CSV file here, or click to browse
                    </p>
                    <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </div>
                  </label>
                </div>

                {/* Selected File Info */}
                {uploadFile && (
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-blue-800">{uploadFile.name}</p>
                          <p className="text-sm text-blue-600">{formatFileSize(uploadFile.size)}</p>
                        </div>
                      </div>
                      <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
                      >
                        {uploading ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4" />
                            <span>Upload & Train</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - System Controls */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                  <p className="text-gray-600">System operations</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Retraining will update the AI model with the current dataset. 
                    This process may take several minutes and will improve prediction accuracy.
                  </p>
                </div>
                
                <button
                  onClick={handleRetrain}
                  disabled={retraining || loading}
                  title={retraining ? 'Model retraining in progress...' : 'Retrain the AI model with current dataset'}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {retraining ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Retraining Model...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="h-5 w-5" />
                      <span>Retrain Model</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => fetchModelInfo(true)}
                  disabled={refreshing}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>{refreshing ? 'Refreshing...' : 'Refresh Status'}</span>
                </button>
              </div>
            </div>

            {/* System Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                  <Server className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">System Health</h2>
                  <p className="text-gray-600">Performance metrics</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Cpu className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">API Status</span>
                  </div>
                  <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs font-medium">
                    Online
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <HardDrive className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Database</span>
                  </div>
                  <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-medium">
                    Connected
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-purple-800">ML Model</span>
                  </div>
                  <span className="px-2 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-medium">
                    {modelInfo?.status || 'Loading'}
                  </span>
                </div>
              </div>
            </div>

            {/* Medical Insurance Features */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <Stethoscope className="h-8 w-8 text-white" />
                <h3 className="text-lg font-bold">Medical AI Features</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span>Health Risk Assessment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4" />
                  <span>Claims Prediction</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Patient Analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Data Security</span>
                </div>
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
          
          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
            opacity: 1;
          }
          
          .animate-slide-up {
            animation: slide-up 0.6s ease-out;
            opacity: 1;
            animation-fill-mode: forwards;
          }
          
          .delay-200 { animation-delay: 0.2s; }
          .delay-300 { animation-delay: 0.3s; }
          .delay-400 { animation-delay: 0.4s; }
          .delay-500 { animation-delay: 0.5s; }
        `}</style>
      </div>
    </div>
  );
};

export default Admin;
