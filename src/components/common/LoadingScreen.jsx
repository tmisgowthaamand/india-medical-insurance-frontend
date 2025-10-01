import React, { useState, useEffect } from 'react';
import { Heart, Shield, Activity, Stethoscope, Brain, TrendingUp } from 'lucide-react';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showContent, setShowContent] = useState(false);

  const loadingSteps = [
    { text: "Initializing MediCare+ Platform", icon: Shield, color: "text-blue-500" },
    { text: "Loading AI Models", icon: Brain, color: "text-purple-500" },
    { text: "Connecting to Healthcare Database", icon: Stethoscope, color: "text-green-500" },
    { text: "Preparing Analytics Engine", icon: TrendingUp, color: "text-cyan-500" },
    { text: "Finalizing Security Protocols", icon: Heart, color: "text-red-500" },
    { text: "Ready to Serve", icon: Activity, color: "text-emerald-500" }
  ];

  useEffect(() => {
    setShowContent(true);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15 + 5;
        
        // Update current step based on progress
        const stepIndex = Math.floor((newProgress / 100) * loadingSteps.length);
        setCurrentStep(Math.min(stepIndex, loadingSteps.length - 1));
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onLoadingComplete && onLoadingComplete();
          }, 1000);
          return 100;
        }
        
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onLoadingComplete, loadingSteps.length]);

  const currentStepData = loadingSteps[currentStep];
  const IconComponent = currentStepData?.icon || Shield;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-cyan-900 flex items-center justify-center z-50 overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-40 w-20 h-20 bg-white rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-white rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full animate-pulse delay-1500"></div>
        <div className="absolute top-1/3 right-1/4 w-36 h-36 bg-white rounded-full animate-pulse delay-700"></div>
      </div>

      {/* Floating Medical Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Heart className="absolute top-1/4 left-1/4 w-8 h-8 text-white/20 animate-bounce delay-300" />
        <Activity className="absolute top-1/3 right-1/3 w-10 h-10 text-white/20 animate-pulse delay-700" />
        <Stethoscope className="absolute bottom-1/3 left-1/3 w-6 h-6 text-white/20 animate-bounce delay-1000" />
        <Shield className="absolute bottom-1/4 right-1/4 w-12 h-12 text-white/20 animate-pulse delay-1500" />
        <Brain className="absolute top-1/2 left-1/6 w-7 h-7 text-white/20 animate-bounce delay-2000" />
        <TrendingUp className="absolute bottom-1/2 right-1/6 w-9 h-9 text-white/20 animate-pulse delay-500" />
      </div>

      {/* Main Content */}
      <div className={`text-center z-10 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Logo Section */}
        <div className="mb-12">
          <div className="relative inline-block">
            {/* Logo Background */}
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-3xl shadow-2xl flex items-center justify-center mb-6 mx-auto animate-pulse">
              <div className="relative">
                <Shield className="h-16 w-16 text-white absolute" />
                <Heart className="h-12 w-12 text-white/80 absolute transform translate-x-2 translate-y-2" />
              </div>
              {/* Pulse Ring */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400 to-cyan-400 animate-ping opacity-20"></div>
            </div>
            
            {/* Brand Name */}
            <h1 className="text-5xl font-bold text-white mb-2 tracking-wide">
              MediCare<span className="text-cyan-400">+</span>
            </h1>
            <p className="text-xl text-blue-200 font-light tracking-wider">
              AI-Powered Medical Insurance
            </p>
          </div>
        </div>

        {/* Loading Progress */}
        <div className="w-96 mx-auto mb-8">
          {/* Progress Bar Container */}
          <div className="relative">
            <div className="w-full bg-white/20 rounded-full h-2 mb-4 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
            
            {/* Progress Percentage */}
            <div className="flex justify-between items-center text-white/80 text-sm">
              <span>{Math.round(progress)}%</span>
              <span className="text-cyan-300">Loading...</span>
            </div>
          </div>
        </div>

        {/* Current Step */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className={`p-3 rounded-full bg-white/10 backdrop-blur-sm ${currentStepData?.color || 'text-blue-500'}`}>
            <IconComponent className="h-6 w-6 animate-pulse" />
          </div>
          <p className="text-white/90 text-lg font-medium">
            {currentStepData?.text || "Initializing..."}
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-3 gap-6 max-w-md mx-auto text-white/70 text-sm">
          <div className="text-center">
            <Brain className="h-6 w-6 mx-auto mb-2 text-purple-400" />
            <p>AI Predictions</p>
          </div>
          <div className="text-center">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-400" />
            <p>Analytics</p>
          </div>
          <div className="text-center">
            <Shield className="h-6 w-6 mx-auto mb-2 text-blue-400" />
            <p>Secure</p>
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2 mt-8">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
