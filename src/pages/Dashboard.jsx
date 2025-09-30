import React, { useState, useEffect } from 'react';
import { dashboardAPI, handleAPIError } from '../api';
import { 
  Users, 
  IndianRupee, 
  TrendingUp, 
  Activity,
  RefreshCw,
  AlertCircle
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, modelData] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getModelInfo()
      ]);
      setStats(statsData);
      setModelInfo(modelData);
    } catch (error) {
      handleAPIError(error, 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-primary-600" />
          <span className="text-lg text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load data</h2>
          <button
            onClick={fetchData}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const regionData = Object.entries(stats.regions).map(([region, count]) => ({
    region,
    count,
    percentage: ((count / stats.total_policies) * 100).toFixed(1)
  }));

  const genderData = Object.entries(stats.gender_distribution).map(([gender, count]) => ({
    gender,
    count,
    percentage: ((count / stats.total_policies) * 100).toFixed(1)
  }));

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        {/* Logo and Brand Section */}
        <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-2xl p-6 mb-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Logo size="large" showText={true} onDark={true} />
              <div>
                <h1 className="text-2xl font-bold">Medical Insurance Dashboard</h1>
                <p className="text-blue-100 mt-1">
                  AI-Powered Analytics & Insights
                </p>
              </div>
            </div>
            <button
              onClick={fetchData}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200 backdrop-blur-sm"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>
            <p className="mt-2 text-gray-600">
              Real-time insights into medical insurance data and model performance
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Policies</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.total_policies.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <IndianRupee className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Premium</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(stats.avg_premium)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Claim</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(stats.avg_claim)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Smokers</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.smoker_percentage.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Region Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Policies by Region
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [value, 'Policies']}
                labelFormatter={(label) => `Region: ${label}`}
              />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Gender Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ gender, percentage }) => `${gender}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Information */}
      {modelInfo && (
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Model Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="text-lg font-semibold text-green-600">
                {modelInfo.status}
              </p>
            </div>
            {modelInfo.test_r2 && (
              <div>
                <p className="text-sm font-medium text-gray-500">R² Score</p>
                <p className="text-lg font-semibold text-gray-900">
                  {(modelInfo.test_r2 * 100).toFixed(1)}%
                </p>
              </div>
            )}
            {modelInfo.test_rmse && (
              <div>
                <p className="text-sm font-medium text-gray-500">RMSE</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(modelInfo.test_rmse)}
                </p>
              </div>
            )}
            {modelInfo.training_samples && (
              <div>
                <p className="text-sm font-medium text-gray-500">Training Samples</p>
                <p className="text-lg font-semibold text-gray-900">
                  {modelInfo.training_samples.toLocaleString()}
                </p>
              </div>
            )}
          </div>
          
          {modelInfo.training_date && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Last trained: {new Date(modelInfo.training_date).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Key Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Average Age</span>
              <span className="font-semibold">{stats.avg_age.toFixed(1)} years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average BMI</span>
              <span className="font-semibold">{stats.avg_bmi.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Claim Ratio</span>
              <span className="font-semibold">
                {((stats.avg_claim / stats.avg_premium) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/prediction'}
              className="w-full btn-primary text-left"
            >
              Make Prediction
            </button>
            <button
              onClick={() => window.location.href = '/claims-analysis'}
              className="w-full btn-secondary text-left"
            >
              View Claims Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
