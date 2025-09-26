import React, { useState } from 'react';
import { predictionAPI, handleAPIError } from '../api';
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
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

const Prediction = () => {
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
      toast.success('Prediction generated successfully!');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
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
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Patient Information</h2>
                <p className="text-gray-600">Enter medical and demographic details</p>
              </div>
            </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="label">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="e.g., 35"
                    value={formData.age}
                    onChange={handleChange}
                  />
                  <Users className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="bmi" className="label">
                  BMI *
                </label>
                <input
                  type="number"
                  id="bmi"
                  name="bmi"
                  required
                  min="10"
                  max="50"
                  step="0.1"
                  className="input-field"
                  placeholder="e.g., 25.5"
                  value={formData.bmi}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="gender" className="label">
                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  className="input-field"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label htmlFor="smoker" className="label">
                  Smoker *
                </label>
                <select
                  id="smoker"
                  name="smoker"
                  required
                  className="input-field"
                  value={formData.smoker}
                  onChange={handleChange}
                >
                  <option value="">Select Status</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="region" className="label">
                Region *
              </label>
              <select
                id="region"
                name="region"
                required
                className="input-field"
                value={formData.region}
                onChange={handleChange}
              >
                <option value="">Select Region</option>
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="East">East</option>
                <option value="West">West</option>
              </select>
            </div>

            <div>
              <label htmlFor="premium_annual_inr" className="label">
                Annual Premium (₹)
              </label>
              <input
                type="number"
                id="premium_annual_inr"
                name="premium_annual_inr"
                min="0"
                className="input-field"
                placeholder="e.g., 25000 (optional)"
                value={formData.premium_annual_inr}
                onChange={handleChange}
              />
              <p className="mt-1 text-sm text-gray-500">
                Leave empty if unknown - the model will estimate
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary flex items-center justify-center space-x-2"
              >
                <Brain className="h-4 w-4" />
                <span>{loading ? 'Predicting...' : 'Predict Claim Amount'}</span>
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Reset
              </button>
            </div>
          </form>
          </div>

          {/* Prediction Results */}
          <div className="space-y-6">
            {prediction ? (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Prediction Results
              </h2>

              <div className="space-y-6">
                {/* Main Prediction */}
                <div className="text-center p-6 bg-primary-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Predicted Claim Amount
                  </p>
                  <p className="text-4xl font-bold text-primary-600">
                    {formatCurrency(prediction.prediction)}
                  </p>
                </div>

                {/* Confidence Score */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className={`h-5 w-5 ${getConfidenceColor(prediction.confidence)}`} />
                    <span className="font-medium text-gray-700">Confidence</span>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${getConfidenceColor(prediction.confidence)}`}>
                      {getConfidenceText(prediction.confidence)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(prediction.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Input Summary */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Input Summary
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
                          : 'Not provided'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Risk Factors */}
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Risk Factors
                  </h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {prediction.input_data.smoker === 'Yes' && (
                      <li>• Smoking significantly increases claim risk</li>
                    )}
                    {prediction.input_data.age > 50 && (
                      <li>• Age over 50 increases medical claim probability</li>
                    )}
                    {prediction.input_data.bmi > 30 && (
                      <li>• BMI over 30 (obesity) increases health risks</li>
                    )}
                    {prediction.input_data.bmi < 18.5 && (
                      <li>• BMI under 18.5 (underweight) may indicate health issues</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="card text-center py-12">
              <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Ready to Predict
              </h3>
              <p className="text-gray-600">
                Fill out the form on the left to generate a claim amount prediction
              </p>
            </div>
            )}

            {/* Model Info */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                About the Model
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  This prediction uses a Random Forest Regressor trained on historical 
                  medical insurance data from India.
                </p>
                <p>
                  The model considers factors like age, BMI, smoking status, gender, 
                  region, and premium amount to predict claim amounts.
                </p>
                <p className="text-xs text-gray-500 mt-4">
                  <strong>Disclaimer:</strong> This is a demo model for educational purposes. 
                  Actual insurance decisions should involve comprehensive risk assessment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prediction;
