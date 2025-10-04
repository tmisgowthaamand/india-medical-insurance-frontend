import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictionAPI, handleAPIError, authAPI } from '../services/api';
import Breadcrumb from '../components/Breadcrumb';
import { 
  Brain, 
  Calculator, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Heart,
  Activity,
  Shield,
  Stethoscope,
  Users,
  Target,
  BarChart3,
  Info,
  Zap,
  RefreshCw,
  ArrowLeft,
  Home,
  Scale,
  Gauge,
  TrendingDown,
  Eye,
  Mail,
  Download,
  Send
} from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '../components/common/Logo';

const Prediction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: '',
    bmi: '',
    gender: '',
    smoker: '',
    region: '',
    premium_annual_inr: '',
    email: '',
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check authentication and scroll to top when component mounts
  useEffect(() => {
    // Check if user is authenticated
    if (!authAPI.isAuthenticated()) {
      toast.error('Please login to access the prediction feature');
      navigate('/login');
      return;
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Show immediate loading feedback
    setLoading(true);
    toast.loading('🧠 Analyzing patient data...', { id: 'prediction-loading' });

    try {
      // Check authentication before making prediction
      if (!authAPI.isAuthenticated()) {
        toast.dismiss('prediction-loading');
        toast.error('Please login to make predictions');
        navigate('/login');
        return;
      }

      // Convert numeric fields
      const data = {
        ...formData,
        age: parseInt(formData.age),
        bmi: parseFloat(formData.bmi),
        premium_annual_inr: parseFloat(formData.premium_annual_inr),
        email: formData.email || null,
      };

      console.log('🚀 Starting prediction API call...');
      const startTime = Date.now();
      
      const result = await predictionAPI.predict(data);
      
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      console.log(`✅ Prediction completed in ${duration}s`);
      
      setPrediction(result);
      
      // Dismiss loading and show success
      toast.dismiss('prediction-loading');
      toast.success(`🎉 Prediction generated successfully in ${duration}s!`);
      
    } catch (error) {
      console.error('❌ Prediction error:', error);
      toast.dismiss('prediction-loading');
      
      if (error.response?.status === 401) {
        toast.error('Authentication expired. Please login again.');
        authAPI.logout();
        navigate('/login');
      } else {
        handleAPIError(error, 'Prediction failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      age: '',
      bmi: '',
      gender: '',
      smoker: '',
      region: '',
      premium_annual_inr: '',
      email: '',
    });
    setPrediction(null);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceText = (confidence) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  const getConfidenceBgColor = (confidence) => {
    if (confidence >= 0.8) return 'bg-green-50 border-green-200';
    if (confidence >= 0.6) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  // BMI Category Functions
  const getBMICategory = (bmi) => {
    if (!bmi) return null;
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return { category: 'Underweight', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' };
    if (bmiValue < 25) return { category: 'Normal', color: 'text-green-600', bg: 'bg-green-50 border-green-200' };
    if (bmiValue < 30) return { category: 'Overweight', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' };
    return { category: 'Obese', color: 'text-red-600', bg: 'bg-red-50 border-red-200' };
  };

  const getBMIRisk = (bmi) => {
    if (!bmi) return null;
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 16) return { level: 'Severe', color: 'text-red-700', description: 'Severely underweight - high health risk' };
    if (bmiValue < 18.5) return { level: 'Moderate', color: 'text-blue-600', description: 'Underweight - increased health risk' };
    if (bmiValue < 25) return { level: 'Low', color: 'text-green-600', description: 'Normal weight - optimal health range' };
    if (bmiValue < 30) return { level: 'Moderate', color: 'text-yellow-600', description: 'Overweight - moderate health risk' };
    if (bmiValue < 35) return { level: 'High', color: 'text-orange-600', description: 'Class I obesity - high health risk' };
    if (bmiValue < 40) return { level: 'Very High', color: 'text-red-600', description: 'Class II obesity - very high health risk' };
    return { level: 'Extreme', color: 'text-red-700', description: 'Class III obesity - extreme health risk' };
  };

  const isOutlier = (value, type) => {
    if (type === 'age') {
      return value < 18 || value > 80;
    }
    if (type === 'bmi') {
      return value < 15 || value > 45;
    }
    return false;
  };

  // Email and Download Functions
  const sendEmailReport = async () => {
    const email = formData.email.trim().toLowerCase();
    if (!email || !email.trim()) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!predictionData) {
      toast.error('Please generate a prediction first');
      return;
    }

    if (!authAPI.isAuthenticated()) {
      toast.error('Please login to send email reports');
      return;
    }

    // Prevent duplicate email requests (debounce)
    const now = Date.now();
    const lastEmailTime = localStorage.getItem(`lastEmail_${email}`);
    if (lastEmailTime && (now - parseInt(lastEmailTime)) < 30000) { // 30 second cooldown
      toast.error(`Please wait before sending another email to ${email}. Cooldown: 30 seconds.`);
      return;
    }

    // Set the last email time
    localStorage.setItem(`lastEmail_${email}`, now.toString());

    try {
      const emailStartTime = Date.now();

      // Show immediate processing feedback
      toast.loading('📧 Processing your email request...', { id: 'email-loading' });
      
      // Prepare email data
      const emailData = {
        email: email.trim().toLowerCase(),
        prediction: predictionData,
        patient_data: {
          ...formData,
          report_generated: new Date().toISOString()
        }
      };

      console.log('📧 Sending email report to:', email);
      console.log('📊 Prediction amount:', predictionData.prediction);
      
      // Call API - now with enhanced backend that provides immediate feedback
      const result = await predictionAPI.sendPredictionEmail(emailData);
      
      const emailDuration = ((Date.now() - emailStartTime) / 1000).toFixed(2);
      
      // Dismiss loading toast
      toast.dismiss('email-loading');
      
      // Show HONEST feedback based on actual backend response
      console.log('📊 Processing email result:', result);
      
      if (result.success) {
        const message = result.message || 'Email processed';
        
        // Check for actual Gmail delivery confirmation
        if (message.includes('✅ Email delivered successfully') || 
            message.includes('Gmail delivery successful') ||
            message.includes('sent successfully')) {
          // Email was actually delivered to Gmail
          toast.success(
            `✅ Email delivered successfully to ${email}!
            
📧 Check your Gmail inbox now
📬 Subject: "MediCare+ Medical Insurance Report"
⏱️ Delivered in ${emailDuration}s
💡 Check spam folder if not in inbox`, 
            {
              duration: 8000,
              style: {
                maxWidth: '500px',
              }
            }
          );
        } else if (message.includes('stored locally') || message.includes('Local Storage')) {
          // Email was NOT sent - show warning
          toast.error(
            `⚠️ Email NOT delivered to ${email}
            
📁 Email stored locally (not sent to Gmail)
🔧 Email service not configured properly
⏱️ Processing time: ${emailDuration}s
💡 Use Download option to save report`, 
            {
              duration: 12000,
              style: {
                maxWidth: '500px',
                background: '#FFA500',
                color: 'white'
              }
            }
          );
        } else {
          // Generic success - show cautious message
          toast.success(
            `📧 Email request processed for ${email}
            
${message}
⏱️ Processing time: ${emailDuration}s
💡 Check Gmail inbox and spam folder`, 
            {
              duration: 8000,
              style: {
                maxWidth: '500px',
              }
            }
          );
        }
      } else {
        // Show HONEST error message when email fails
        const errorMessage = result.message || 'Gmail delivery error occurred';
        
        // Check for specific error types
        if (errorMessage.includes('Gmail connection failed') || 
            errorMessage.includes('Authentication failed') ||
            errorMessage.includes('SMTP')) {
          toast.error(
            `❌ Gmail connection failed for ${email}
            
🔧 ${errorMessage}
⏱️ Processing time: ${emailDuration}s
💡 Email service may be temporarily unavailable
📥 Use Download option to save report locally`, 
            {
              duration: 12000,
              style: {
                maxWidth: '500px',
              }
            }
          );
        } else if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
          toast.error(
            `⏰ Email request timed out for ${email}
            
${errorMessage}
⏱️ Processing time: ${emailDuration}s
💡 Server may be slow - please try again
📥 Use Download option to save report locally`, 
            {
              duration: 10000,
              style: {
                maxWidth: '500px',
              }
            }
          );
        } else {
          toast.error(
            `❌ Email delivery failed to ${email}
            
${errorMessage}
⏱️ Processing time: ${emailDuration}s
💡 Please try again or use Download option below`, 
            {
              duration: 10000,
              style: {
                maxWidth: '500px',
              }
            }
          );
        }
      }
      
    } catch (error) {
      const emailDuration = ((Date.now() - emailStartTime) / 1000).toFixed(2);
      console.error('Email sending error:', error);
      toast.dismiss('email-loading');
      
      // Show HONEST error message for network/API failures
      toast.error(
        `❌ Email sending failed: ${error.message || 'Network error'}
        
⏱️ Processing time: ${emailDuration}s
💡 Please check your internet connection and try again
📥 Use Download option to save report locally`, 
        {
          duration: 10000,
          style: {
            maxWidth: '500px',
          }
        }
      );
    }
  };

  const downloadReport = (predictionData) => {
    try {
      // Create a comprehensive report object
      const reportData = {
        timestamp: new Date().toLocaleString('en-IN'),
        patient_info: {
          age: formData.age,
          bmi: formData.bmi,
          gender: formData.gender,
          smoker: formData.smoker,
          region: formData.region,
          premium: formData.premium_annual_inr || 'Estimated'
        },
        prediction: {
          claim_amount: formatCurrency(predictionData.prediction),
          confidence: (predictionData.confidence * 100).toFixed(1) + '%',
          risk_level: getBMIRisk(formData.bmi)?.level || 'Unknown'
        },
        bmi_analysis: {
          category: getBMICategory(formData.bmi)?.category || 'Unknown',
          risk_description: getBMIRisk(formData.bmi)?.description || 'No analysis available'
        }
      };
      
      // Create downloadable content
      const reportContent = `
MEDICARE+ PREDICTION REPORT
============================

Generated: ${reportData.timestamp}

PATIENT INFORMATION:
- Age: ${reportData.patient_info.age} years
- BMI: ${reportData.patient_info.bmi}
- Gender: ${reportData.patient_info.gender}
- Smoking Status: ${reportData.patient_info.smoker}
- Region: ${reportData.patient_info.region}
- Annual Premium: ₹${reportData.patient_info.premium}

PREDICTION RESULTS:
- Predicted Claim Amount: ${reportData.prediction.claim_amount}
- Confidence Level: ${reportData.prediction.confidence}
- Risk Level: ${reportData.prediction.risk_level}

BMI ANALYSIS:
- BMI Category: ${reportData.bmi_analysis.category}
- Health Risk: ${reportData.bmi_analysis.risk_description}

============================
Generated by MediCare+ AI Platform
For medical consultation purposes only
      `;
      
      // Create and download file
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `MediCare_Prediction_Report_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('📄 Report downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download report. Please try again.');
      console.error('Download error:', error);
    }
  };

  // BMI Gauge Component
  const BMIGauge = ({ bmi }) => {
    if (!bmi) return null;
    
    const bmiValue = parseFloat(bmi);
    const maxBMI = 40;
    const percentage = Math.min((bmiValue / maxBMI) * 100, 100);
    const category = getBMICategory(bmi);
    
    return (
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Gauge className="h-5 w-5 text-purple-600" />
            <span className="font-medium text-gray-700">BMI Analysis</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${category?.bg} ${category?.color}`}>
            {category?.category}
          </span>
        </div>
        
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className="h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-500"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>15</span>
            <span>18.5</span>
            <span>25</span>
            <span>30</span>
            <span>40+</span>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold text-purple-600">{bmiValue}</span>
            <span className="text-sm text-gray-500 ml-1">kg/m²</span>
          </div>
        </div>
        
        <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
          <div className="text-center p-2 bg-blue-50 rounded">
            <div className="text-blue-600 font-medium">&lt;18.5</div>
            <div className="text-blue-500">Under</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <div className="text-green-600 font-medium">18.5-25</div>
            <div className="text-green-500">Normal</div>
          </div>
          <div className="text-center p-2 bg-yellow-50 rounded">
            <div className="text-yellow-600 font-medium">25-30</div>
            <div className="text-yellow-500">Over</div>
          </div>
          <div className="text-center p-2 bg-red-50 rounded">
            <div className="text-red-600 font-medium">&gt;30</div>
            <div className="text-red-500">Obese</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          {/* Breadcrumb Navigation */}
          <Breadcrumb />
          
          {/* Back Button */}
          <div className="mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-gray-700 hover:text-purple-600"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Logo size="large" showText={true} onDark={true} />
                <div>
                  <h1 className="text-3xl font-bold">AI Claim Prediction</h1>
                  <p className="text-purple-100 mt-2">
                    MediCare+ ML-powered claim estimation
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <div className="text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 text-purple-200" />
                  <p className="text-sm text-purple-100">Accurate</p>
                </div>
                <div className="text-center">
                  <Zap className="h-8 w-8 mx-auto mb-2 text-purple-200" />
                  <p className="text-sm text-purple-100">Fast</p>
                </div>
                <div className="text-center">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-purple-200" />
                  <p className="text-sm text-purple-100">Secure</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Prediction Form */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Patient Information</h2>
                <p className="text-gray-600">Enter medical and demographic details</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                    Age *
                    {formData.age && isOutlier(parseInt(formData.age), 'age') && (
                      <span className="ml-2 px-2 py-1 rounded text-xs font-medium bg-red-50 text-red-600">
                        Outlier
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="age"
                      name="age"
                      required
                      min="18"
                      max="100"
                      className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white group-hover:border-gray-400 ${
                        formData.age && isOutlier(parseInt(formData.age), 'age') 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300'
                      }`}
                      placeholder="e.g., 35"
                      value={formData.age}
                      onChange={handleChange}
                    />
                    <Users className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                    {formData.age && isOutlier(parseInt(formData.age), 'age') && (
                      <div className="absolute right-10 top-3">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {formData.age && isOutlier(parseInt(formData.age), 'age') && (
                    <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>Outlier detected: Age is outside typical range (18-80 years)</span>
                    </p>
                  )}
                </div>

                <div className="group">
                  <label htmlFor="bmi" className="block text-sm font-medium text-gray-700 mb-2">
                    BMI * 
                    {formData.bmi && (
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                        getBMICategory(formData.bmi)?.bg
                      } ${
                        getBMICategory(formData.bmi)?.color
                      }`}>
                        {getBMICategory(formData.bmi)?.category}
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="bmi"
                      name="bmi"
                      required
                      min="10"
                      max="50"
                      step="0.1"
                      className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white group-hover:border-gray-400 ${
                        formData.bmi && isOutlier(parseFloat(formData.bmi), 'bmi') 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300'
                      }`}
                      placeholder="e.g., 25.5"
                      value={formData.bmi}
                      onChange={handleChange}
                    />
                    <Activity className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                    {formData.bmi && isOutlier(parseFloat(formData.bmi), 'bmi') && (
                      <div className="absolute right-10 top-3">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {formData.bmi && (
                    <div className="mt-2 space-y-1">
                      {getBMIRisk(formData.bmi) && (
                        <p className={`text-sm ${getBMIRisk(formData.bmi).color}`}>
                          <span className="font-medium">{getBMIRisk(formData.bmi).level} Risk:</span> {getBMIRisk(formData.bmi).description}
                        </p>
                      )}
                      {isOutlier(parseFloat(formData.bmi), 'bmi') && (
                        <p className="text-sm text-red-600 flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>Outlier detected: BMI value is outside normal range (15-45)</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white group-hover:border-gray-400"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="group">
                  <label htmlFor="smoker" className="block text-sm font-medium text-gray-700 mb-2">
                    Smoking Status *
                  </label>
                  <select
                    id="smoker"
                    name="smoker"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white group-hover:border-gray-400"
                    value={formData.smoker}
                    onChange={handleChange}
                  >
                    <option value="">Select Status</option>
                    <option value="Yes">Smoker</option>
                    <option value="No">Non-Smoker</option>
                  </select>
                </div>
              </div>

              <div className="group">
                <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                  Geographic Region *
                </label>
                <select
                  id="region"
                  name="region"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white group-hover:border-gray-400"
                  value={formData.region}
                  onChange={handleChange}
                >
                  <option value="">Select Region</option>
                  <option value="North">North India</option>
                  <option value="South">South India</option>
                  <option value="East">East India</option>
                  <option value="West">West India</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <label htmlFor="premium_annual_inr" className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Premium (₹) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="premium_annual_inr"
                      name="premium_annual_inr"
                      required
                      min="1000"
                      max="1000000"
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white group-hover:border-gray-400"
                      placeholder="e.g., 25000"
                      value={formData.premium_annual_inr}
                      onChange={handleChange}
                    />
                    <BarChart3 className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Enter your annual insurance premium amount
                  </p>
                </div>

                <div className="group">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white group-hover:border-gray-400"
                      placeholder="your.email@example.com (optional)"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Receive prediction report via email
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="h-5 w-5" />
                      <span>Predict Claim Amount</span>
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors duration-200"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          
          {/* Right Column - BMI Visualization & Prediction Results */}
          <div className="space-y-6 relative z-10">
            {/* Comprehensive BMI Analysis Dashboard */}
            {formData.bmi && (
              <div className="space-y-6">
                {/* BMI Analysis Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-xl">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">BMI Health Analysis</h2>
                      <p className="text-indigo-100">Comprehensive body mass index assessment</p>
                    </div>
                  </div>
                  
                  {/* Quick BMI Status */}
                  <div className="flex items-center justify-between bg-white bg-opacity-10 rounded-xl p-4">
                    <div>
                      <div className="text-3xl font-bold">{parseFloat(formData.bmi).toFixed(1)}</div>
                      <div className="text-indigo-100">Your BMI</div>
                    </div>
                    <div className="text-right">
                      <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        getBMICategory(formData.bmi)?.category === 'Normal' ? 'bg-green-500' :
                        getBMICategory(formData.bmi)?.category === 'Underweight' ? 'bg-blue-500' :
                        getBMICategory(formData.bmi)?.category === 'Overweight' ? 'bg-yellow-500' : 'bg-red-500'
                      } text-white`}>
                        {getBMICategory(formData.bmi)?.category}
                      </div>
                      <div className="text-indigo-100 text-sm mt-1">
                        {getBMIRisk(formData.bmi)?.level} Risk Level
                      </div>
                    </div>
                  </div>
                </div>

                {/* BMI Gauge Visualization */}
                <BMIGauge bmi={formData.bmi} />
                
                {/* BMI Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Current BMI Stats */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
                    <div className="flex items-center space-x-2 mb-4">
                      <Scale className="h-5 w-5 text-purple-600" />
                      <span className="font-semibold text-gray-800">BMI Statistics</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="text-gray-600">Current BMI</span>
                        <span className="text-2xl font-bold text-purple-600">{parseFloat(formData.bmi).toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-gray-600">Healthy Range</span>
                        <span className="text-lg font-semibold text-green-600">18.5 - 24.9</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Category</span>
                        <span className={`font-semibold ${getBMICategory(formData.bmi)?.color}`}>
                          {getBMICategory(formData.bmi)?.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* BMI Trends & Comparison */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
                    <div className="flex items-center space-x-2 mb-4">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-gray-800">BMI Distribution</span>
                    </div>
                    <div className="space-y-3">
                      {/* BMI Categories with percentages */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-600">Underweight (&lt;18.5)</span>
                          <span className="text-gray-500">~2% population</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-400 h-2 rounded-full" style={{width: '2%'}}></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-green-600">Normal (18.5-24.9)</span>
                          <span className="text-gray-500">~40% population</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-400 h-2 rounded-full" style={{width: '40%'}}></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-yellow-600">Overweight (25-29.9)</span>
                          <span className="text-gray-500">~35% population</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-400 h-2 rounded-full" style={{width: '35%'}}></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-red-600">Obese (&gt;30)</span>
                          <span className="text-gray-500">~23% population</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-red-400 h-2 rounded-full" style={{width: '23%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Health Risk Assessment */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
                  <div className="flex items-center space-x-2 mb-4">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span className="font-semibold text-gray-800">Health Risk Assessment</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Risk Level */}
                    <div className={`p-4 rounded-xl border-2 ${
                      getBMIRisk(formData.bmi)?.level === 'Low' ? 'border-green-200 bg-green-50' :
                      getBMIRisk(formData.bmi)?.level === 'Moderate' ? 'border-yellow-200 bg-yellow-50' :
                      getBMIRisk(formData.bmi)?.level === 'High' ? 'border-orange-200 bg-orange-50' :
                      'border-red-200 bg-red-50'
                    }`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertCircle className={`h-5 w-5 ${
                          getBMIRisk(formData.bmi)?.level === 'Low' ? 'text-green-600' :
                          getBMIRisk(formData.bmi)?.level === 'Moderate' ? 'text-yellow-600' :
                          getBMIRisk(formData.bmi)?.level === 'High' ? 'text-orange-600' :
                          'text-red-600'
                        }`} />
                        <span className="font-semibold text-gray-800">Risk Level</span>
                      </div>
                      <div className={`text-lg font-bold ${getBMIRisk(formData.bmi)?.color}`}>
                        {getBMIRisk(formData.bmi)?.level} Risk
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {getBMIRisk(formData.bmi)?.description}
                      </div>
                    </div>

                    {/* Outlier Detection */}
                    <div className={`p-4 rounded-xl border-2 ${
                      isOutlier(parseFloat(formData.bmi), 'bmi') ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <Eye className={`h-5 w-5 ${
                          isOutlier(parseFloat(formData.bmi), 'bmi') ? 'text-purple-600' : 'text-gray-600'
                        }`} />
                        <span className="font-semibold text-gray-800">Outlier Analysis</span>
                      </div>
                      {isOutlier(parseFloat(formData.bmi), 'bmi') ? (
                        <>
                          <div className="text-lg font-bold text-purple-600">Outlier Detected</div>
                          <div className="text-sm text-purple-600 mt-1">
                            BMI value is outside typical range (15-45). Requires special medical consideration.
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-lg font-bold text-gray-600">Normal Range</div>
                          <div className="text-sm text-gray-600 mt-1">
                            BMI value is within expected range for analysis.
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Health Recommendations */}
                {getBMICategory(formData.bmi)?.category !== 'Normal' && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center space-x-2 mb-4">
                      <Info className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-blue-800">Personalized Health Recommendations</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-medium text-blue-800">Dietary Guidelines</h4>
                        <div className="text-sm text-blue-700 space-y-2">
                          {parseFloat(formData.bmi) < 18.5 && (
                            <>
                              <p className="flex items-start space-x-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>Increase caloric intake with nutrient-dense foods</span>
                              </p>
                              <p className="flex items-start space-x-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>Focus on healthy fats, proteins, and complex carbs</span>
                              </p>
                              <p className="flex items-start space-x-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>Consider consulting a registered dietitian</span>
                              </p>
                            </>
                          )}
                          {parseFloat(formData.bmi) >= 25 && parseFloat(formData.bmi) < 30 && (
                            <>
                              <p className="flex items-start space-x-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>Maintain a balanced diet with portion control</span>
                              </p>
                              <p className="flex items-start space-x-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>Reduce processed foods and added sugars</span>
                              </p>
                              <p className="flex items-start space-x-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>Increase fiber intake with fruits and vegetables</span>
                              </p>
                            </>
                          )}
                          {parseFloat(formData.bmi) >= 30 && (
                            <>
                              <p className="flex items-start space-x-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>Consult healthcare provider for weight management</span>
                              </p>
                              <p className="flex items-start space-x-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>Consider medically supervised diet program</span>
                              </p>
                              <p className="flex items-start space-x-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>Focus on sustainable lifestyle changes</span>
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-medium text-blue-800">Exercise Recommendations</h4>
                        <div className="text-sm text-blue-700 space-y-2">
                          {parseFloat(formData.bmi) < 18.5 && (
                            <>
                              <p className="flex items-start space-x-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>Focus on strength training to build muscle mass</span>
                              </p>
                              <p className="flex items-start space-x-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>Moderate cardio 3-4 times per week</span>
                              </p>
                              <p className="flex items-start space-x-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>Consider working with a fitness trainer</span>
                              </p>
                            </>
                          )}
                          {parseFloat(formData.bmi) >= 25 && parseFloat(formData.bmi) < 30 && (
                            <>
                              <p className="flex items-start space-x-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>Aim for 150+ minutes of moderate activity weekly</span>
                              </p>
                              <p className="flex items-start space-x-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>Combine cardio with strength training</span>
                              </p>
                              <p className="flex items-start space-x-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>Increase daily physical activity</span>
                              </p>
                            </>
                          )}
                          {parseFloat(formData.bmi) >= 30 && (
                            <>
                              <p className="flex items-start space-x-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>Start with low-impact exercises</span>
                              </p>
                              <p className="flex items-start space-x-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>Gradually increase activity duration</span>
                              </p>
                              <p className="flex items-start space-x-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>Consider supervised exercise programs</span>
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* AI Prediction Results */}
            {prediction ? (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Prediction Results</h2>
                    <p className="text-gray-600">AI-generated claim estimation</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Main Prediction */}
                  <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Heart className="h-5 w-5 text-purple-600" />
                      <p className="text-sm font-medium text-purple-800">
                        Predicted Claim Amount
                      </p>
                    </div>
                    <p className="text-4xl font-bold text-purple-600 mb-2">
                      {formatCurrency(prediction.prediction)}
                    </p>
                    <p className="text-sm text-purple-600">
                      Based on medical risk factors
                    </p>
                  </div>

                  {/* Confidence Score */}
                  <div className={`flex items-center justify-between p-4 rounded-xl border ${getConfidenceBgColor(prediction.confidence)}`}>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className={`h-5 w-5 ${getConfidenceColor(prediction.confidence)}`} />
                      <span className="font-medium text-gray-700">Prediction Confidence</span>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${getConfidenceColor(prediction.confidence)}`}>
                        {getConfidenceText(prediction.confidence)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(prediction.confidence * 100).toFixed(1)}% accuracy
                      </p>
                    </div>
                  </div>

                  {/* Input Summary */}
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <Info className="h-5 w-5 mr-2 text-gray-600" />
                      Patient Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Age:</span>
                        <span className="font-medium">{prediction.input_data.age} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">BMI:</span>
                        <span className="font-medium">{prediction.input_data.bmi}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gender:</span>
                        <span className="font-medium">{prediction.input_data.gender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Smoker:</span>
                        <span className="font-medium">{prediction.input_data.smoker}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Region:</span>
                        <span className="font-medium">{prediction.input_data.region}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Premium:</span>
                        <span className="font-medium">
                          {prediction.input_data.premium_annual_inr 
                            ? formatCurrency(prediction.input_data.premium_annual_inr)
                            : 'Estimated'
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Email & Download Actions */}
                  {formData.email && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                        <Mail className="h-5 w-5 mr-2" />
                        Report Delivery Options
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <button
                          onClick={() => sendEmailReport(prediction, formData.email)}
                          className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                        >
                          <Send className="h-4 w-4" />
                          <span>Email Report</span>
                        </button>
                        <button
                          onClick={() => downloadReport(prediction)}
                          className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download PDF</span>
                        </button>
                      </div>
                      <p className="text-sm text-blue-600 mt-2">
                        📧 Report will be sent to: <strong>{formData.email}</strong>
                      </p>
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-700">
                          <strong>💡 Tip:</strong> If email delivery fails, use the "Download PDF" button to save your report locally. 
                          Email service may be temporarily unavailable.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Enhanced Risk Factors with BMI Analysis */}
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                    <h4 className="font-medium text-orange-800 mb-3 flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Comprehensive Health Risk Assessment
                    </h4>
                    <div className="space-y-3">
                      {/* BMI Risk Analysis */}
                      <div className="bg-white p-3 rounded-lg border border-orange-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-700">BMI Risk Level</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            getBMICategory(prediction.input_data.bmi)?.bg
                          } ${
                            getBMICategory(prediction.input_data.bmi)?.color
                          }`}>
                            {getBMICategory(prediction.input_data.bmi)?.category}
                          </span>
                        </div>
                        <div className={`text-sm ${
                          getBMIRisk(prediction.input_data.bmi)?.color
                        }`}>
                          <span className="font-medium">{getBMIRisk(prediction.input_data.bmi)?.level} Risk:</span> {getBMIRisk(prediction.input_data.bmi)?.description}
                        </div>
                      </div>
                      
                      {/* Other Risk Factors */}
                      <div className="space-y-2 text-sm text-orange-700">
                        {prediction.input_data.smoker === 'Yes' && (
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span>Smoking significantly increases claim risk (+150-200%)</span>
                          </div>
                        )}
                        {prediction.input_data.age > 50 && (
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span>Age over 50 increases medical claim probability</span>
                          </div>
                        )}
                        {prediction.input_data.bmi > 30 && (
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span>Obesity (BMI &gt;30) increases diabetes, heart disease risk</span>
                          </div>
                        )}
                        {prediction.input_data.bmi > 35 && (
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-700 rounded-full"></div>
                            <span>Severe obesity increases surgical complications risk</span>
                          </div>
                        )}
                        {prediction.input_data.bmi < 18.5 && (
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Underweight may indicate nutritional deficiency</span>
                          </div>
                        )}
                        {prediction.input_data.bmi < 16 && (
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                            <span>Severe underweight increases immune system risks</span>
                          </div>
                        )}
                        {isOutlier(prediction.input_data.age, 'age') && (
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>Age outlier detected - requires special consideration</span>
                          </div>
                        )}
                        {isOutlier(prediction.input_data.bmi, 'bmi') && (
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>BMI outlier detected - extreme value requires medical review</span>
                          </div>
                        )}
                        {prediction.input_data.smoker === 'No' && prediction.input_data.age <= 50 && prediction.input_data.bmi >= 18.5 && prediction.input_data.bmi <= 25 && (
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Optimal health profile - low risk indicators</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mx-auto mb-4">
                  <Brain className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Ready for AI Analysis
                </h3>
                <p className="text-gray-600 mb-4">
                  Fill out the patient information form to generate a precise claim amount prediction
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Target className="h-4 w-4" />
                    <span>Accurate</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Zap className="h-4 w-4" />
                    <span>Fast</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Shield className="h-4 w-4" />
                    <span>Secure</span>
                  </div>
                </div>
              </div>
            )}

            {/* Model Info */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <Brain className="h-8 w-8 text-white" />
                <h3 className="text-lg font-bold">AI Model Information</h3>
              </div>
              <div className="space-y-3 text-sm text-cyan-100">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4" />
                  <span>Random Forest Regressor with 95% accuracy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Trained on 100,000+ medical insurance records</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span>Considers age, BMI, lifestyle, and regional factors</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>HIPAA-compliant data processing</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-cyan-400 text-xs text-cyan-200">
                <strong>Disclaimer:</strong> This AI model is for educational and demonstration purposes. 
                Real insurance decisions require comprehensive medical evaluation and professional assessment.
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
        `}</style>
      </div>
    </div>
  );
};

export default Prediction;
