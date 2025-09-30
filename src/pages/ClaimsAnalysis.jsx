import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI, adminAPI, authAPI, handleAPIError } from '../api';
import Breadcrumb from '../components/Breadcrumb';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  RefreshCw,
  AlertCircle,
  Users,
  IndianRupee,
  Upload,
  Brain,
  FileText,
  Heart,
  Activity,
  Shield,
  Stethoscope,
  Target,
  Zap,
  Info,
  CheckCircle,
  ArrowLeft,
  Home
} from 'lucide-react';
import Logo from '../components/Logo';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  Cell,
  PieChart as RechartsPieChart,
  Pie
} from 'recharts';
import toast from 'react-hot-toast';

const ClaimsAnalysis = () => {
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [retraining, setRetraining] = useState(false);
  const [modelInfo, setModelInfo] = useState(null);
  const isAdmin = authAPI.isAdmin();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analysis, statsData, modelData] = await Promise.all([
        dashboardAPI.getClaimsAnalysis(),
        dashboardAPI.getStats(),
        dashboardAPI.getModelInfo()
      ]);
      setAnalysisData(analysis);
      setStats(statsData);
      setModelInfo(modelData);
    } catch (error) {
      handleAPIError(error, 'Failed to fetch claims analysis data');
    } finally {
      setLoading(false);
    }
  };

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

    setUploading(true);
    try {
      const result = await adminAPI.uploadDataset(uploadFile);
      toast.success(result.message || 'Dataset uploaded and model retrained successfully!');
      setUploadFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-upload-claims');
      if (fileInput) fileInput.value = '';
      // Refresh data
      await fetchData();
    } catch (error) {
      handleAPIError(error, 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRetrain = async () => {
    setRetraining(true);
    try {
      const result = await adminAPI.retrainModel();
      toast.success(result.message || 'Model retrained successfully!');
      // Refresh data
      await fetchData();
    } catch (error) {
      handleAPIError(error, 'Retraining failed');
    } finally {
      setRetraining(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full">
            <RefreshCw className="h-6 w-6 animate-spin text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Loading Claims Analysis</h3>
            <p className="text-gray-600">Analyzing medical insurance data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analysisData || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load data</h2>
          <button onClick={fetchData} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const ageGroupData = Object.entries(analysisData.age_groups.claim_amount_inr || {}).map(([ageGroup, avgClaim]) => ({
    ageGroup,
    avgClaim,
    avgPremium: analysisData.age_groups.premium_annual_inr?.[ageGroup] || 0
  }));

  const regionData = Object.entries(analysisData.region_analysis['claim_amount_inr']?.['mean'] || {}).map(([region, avgClaim]) => ({
    region,
    avgClaim,
    count: analysisData.region_analysis['claim_amount_inr']?.['count']?.[region] || 0,
    avgPremium: analysisData.region_analysis['premium_annual_inr']?.[region] || 0
  }));

  const smokerData = Object.entries(analysisData.smoker_analysis.claim_amount_inr || {}).map(([smokerStatus, avgClaim]) => ({
    smokerStatus,
    avgClaim,
    avgPremium: analysisData.smoker_analysis.premium_annual_inr?.[smokerStatus] || 0
  }));

  const premiumVsClaimsData = Object.entries(analysisData.premium_vs_claims || {}).map(([premiumBand, avgClaim]) => ({
    premiumBand,
    avgClaim
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          {/* Breadcrumb Navigation */}
          <Breadcrumb />
          
          {/* Back Button */}
          <div className="mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-gray-700 hover:text-green-600"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
          </div>

          <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Logo size="large" showText={true} onDark={true} />
                <div>
                  <h1 className="text-3xl font-bold">Claims Analytics</h1>
                  <p className="text-green-100 mt-2">
                    MediCare+ advanced claims analysis and insights
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <div className="text-center">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 text-green-200" />
                  <p className="text-sm text-green-100">Analytics</p>
                </div>
                <div className="text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 text-green-200" />
                  <p className="text-sm text-green-100">Insights</p>
                </div>
                <div className="text-center">
                  <Activity className="h-8 w-8 mx-auto mb-2 text-green-200" />
                  <p className="text-sm text-green-100">Trends</p>
                </div>
              </div>
            </div>
            <button
              onClick={fetchData}
              className="mt-4 flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <IndianRupee className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Claim Amount</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(stats.avg_claim)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Claim Ratio</p>
              <p className="text-2xl font-semibold text-gray-900">
                {((stats.avg_claim / stats.avg_premium) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Policies</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.total_policies.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Controls */}
      {isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Dataset Upload */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Upload New Dataset
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="file-upload-claims" className="block text-sm font-medium text-gray-700 mb-2">
                  Select CSV File
                </label>
                <input
                  id="file-upload-claims"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                {uploadFile && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{uploadFile.name}</span>
                    </div>
                    <p className="text-gray-500 mt-1">
                      Size: {(uploadFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleUpload}
                disabled={!uploadFile || uploading}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <Upload className={`h-4 w-4 ${uploading ? 'animate-pulse' : ''}`} />
                <span>{uploading ? 'Uploading & Training...' : 'Upload & Retrain Model'}</span>
              </button>
            </div>
          </div>

          {/* Model Training */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Model Training
            </h3>
            
            <div className="space-y-4">
              {modelInfo && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600">{modelInfo.status}</span>
                  </div>
                  {modelInfo.test_r2 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">R² Score:</span>
                      <span className="font-medium">{(modelInfo.test_r2 * 100).toFixed(1)}%</span>
                    </div>
                  )}
                  {modelInfo.test_rmse && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">RMSE:</span>
                      <span className="font-medium">{formatCurrency(modelInfo.test_rmse)}</span>
                    </div>
                  )}
                  {modelInfo.training_date && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Trained:</span>
                      <span className="font-medium">{new Date(modelInfo.training_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              )}
              
              <button
                onClick={handleRetrain}
                disabled={retraining}
                className="w-full btn-secondary flex items-center justify-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${retraining ? 'animate-spin' : ''}`} />
                <span>{retraining ? 'Retraining Model...' : 'Retrain with Current Data'}</span>
              </button>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Retraining will rebuild the model using the current dataset. 
                This may take a few minutes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="space-y-8">
        {/* Age Group Analysis */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Claims by Age Group
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={ageGroupData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ageGroup" />
              <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
              <Tooltip 
                formatter={(value, name) => [
                  formatCurrency(value), 
                  name === 'avgClaim' ? 'Avg Claim' : 'Avg Premium'
                ]}
                labelFormatter={(label) => `Age Group: ${label}`}
              />
              <Legend />
              <Bar dataKey="avgClaim" fill="#3B82F6" name="Avg Claim" />
              <Bar dataKey="avgPremium" fill="#10B981" name="Avg Premium" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Region Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Claims by Region
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'Avg Claim']}
                  labelFormatter={(label) => `Region: ${label}`}
                />
                <Bar dataKey="avgClaim" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Policy Count by Region
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ region, count }) => `${region}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Smoker Analysis */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Smoker vs Non-Smoker Claims
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={smokerData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="smokerStatus" />
              <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
              <Tooltip 
                formatter={(value, name) => [
                  formatCurrency(value), 
                  name === 'avgClaim' ? 'Avg Claim' : 'Avg Premium'
                ]}
                labelFormatter={(label) => `Smoker: ${label}`}
              />
              <Legend />
              <Bar dataKey="avgClaim" fill="#EF4444" name="Avg Claim" />
              <Bar dataKey="avgPremium" fill="#10B981" name="Avg Premium" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Premium vs Claims */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Premium Bands vs Average Claims
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={premiumVsClaimsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="premiumBand" />
              <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
              <Tooltip 
                formatter={(value) => [formatCurrency(value), 'Avg Claim']}
                labelFormatter={(label) => `Premium Band: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="avgClaim" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Key Insights
            </h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-800">Age Factor</p>
                <p className="text-blue-700">
                  Older age groups typically show higher claim amounts due to increased health risks.
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="font-medium text-red-800">Smoking Impact</p>
                <p className="text-red-700">
                  Smokers generally have significantly higher claim amounts compared to non-smokers.
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="font-medium text-green-800">Regional Variations</p>
                <p className="text-green-700">
                  Different regions show varying claim patterns, possibly due to healthcare costs and lifestyle factors.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Risk Assessment
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>High Risk Factors</span>
                  <span className="text-red-600">Critical</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">Smoking, Age 50+, High BMI</p>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Medium Risk Factors</span>
                  <span className="text-yellow-600">Moderate</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">Age 30-50, Regional factors</p>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Low Risk Factors</span>
                  <span className="text-green-600">Minimal</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">Young age, Non-smoker, Normal BMI</p>
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
      `}</style>
      </div>
    </div>
  );
};

export default ClaimsAnalysis;
