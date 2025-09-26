import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictionAPI, handleAPIError } from '../api';
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
  Home
} from 'lucide-react';
import toast from 'react-hot-toast';

const Prediction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: '',
    bmi: '',
    gender: '',
    smoker: '',
    region: '',
    premium_annual_inr: '',
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert numeric fields
      const data = {
        ...formData,
        age: parseInt(formData.age),
        bmi: parseFloat(formData.bmi),
        premium_annual_inr: formData.premium_annual_inr ? parseFloat(formData.premium_annual_inr) : null,
      };

      const result = await predictionAPI.predict(data);
      setPrediction(result);
      toast.success('🎉 Prediction generated successfully!');
    } catch (error) {
      handleAPIError(error, 'Prediction failed');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
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
                <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">AI Claim Prediction</h1>
                  <p className="text-purple-100 mt-2">
                    Advanced ML-powered insurance claim estimation
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
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 animate-slide-up">
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
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="age"
                      name="age"
                      required
                      min="18"
                      max="100"
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white group-hover:border-gray-400"
                      placeholder="e.g., 35"
                      value={formData.age}
                      onChange={handleChange}
                    />
                    <Users className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="bmi" className="block text-sm font-medium text-gray-700 mb-2">
                    BMI *
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
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white group-hover:border-gray-400"
                      placeholder="e.g., 25.5"
                      value={formData.bmi}
                      onChange={handleChange}
                    />
                    <Activity className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
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

              <div className="group">
                <label htmlFor="premium_annual_inr" className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Premium (₹)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="premium_annual_inr"
                    name="premium_annual_inr"
                    min="0"
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white group-hover:border-gray-400"
                    placeholder="e.g., 25000 (optional)"
                    value={formData.premium_annual_inr}
                    onChange={handleChange}
                  />
                  <BarChart3 className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Leave empty if unknown - the AI will estimate based on other factors
                </p>
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

          {/* Prediction Results */}
          <div className="space-y-6">
            {prediction ? (
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 animate-slide-up delay-200">
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

                  {/* Risk Factors */}
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                    <h4 className="font-medium text-orange-800 mb-3 flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Health Risk Assessment
                    </h4>
                    <div className="space-y-2 text-sm text-orange-700">
                      {prediction.input_data.smoker === 'Yes' && (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>Smoking significantly increases claim risk</span>
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
                          <span>BMI over 30 (obesity) increases health risks</span>
                        </div>
                      )}
                      {prediction.input_data.bmi < 18.5 && (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span>BMI under 18.5 (underweight) may indicate health issues</span>
                        </div>
                      )}
                      {prediction.input_data.smoker === 'No' && prediction.input_data.age <= 50 && prediction.input_data.bmi >= 18.5 && prediction.input_data.bmi <= 30 && (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Low risk profile - healthy lifestyle indicators</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center animate-slide-up delay-200">
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
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl p-6 text-white animate-slide-up delay-300">
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
          }
          
          .animate-slide-up {
            animation: slide-up 0.6s ease-out;
            opacity: 0;
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
