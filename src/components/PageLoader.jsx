import React from 'react';
import { Shield, Heart, RefreshCw } from 'lucide-react';

const PageLoader = ({ message = "Loading...", size = "medium" }) => {
  const sizeClasses = {
    small: {
      container: "h-32",
      logo: "w-8 h-8",
      text: "text-sm"
    },
    medium: {
      container: "h-64",
      logo: "w-12 h-12",
      text: "text-base"
    },
    large: {
      container: "h-96",
      logo: "w-16 h-16",
      text: "text-lg"
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex flex-col items-center justify-center ${currentSize.container} bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl`}>
      {/* Animated Logo */}
      <div className="relative mb-4">
        <div className={`${currentSize.logo} bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center animate-pulse`}>
          <Shield className="h-1/2 w-1/2 text-white absolute" />
          <Heart className="h-1/3 w-1/3 text-white/80 absolute transform translate-x-0.5 translate-y-0.5" />
        </div>
        
        {/* Spinning Ring */}
        <div className={`absolute inset-0 ${currentSize.logo} border-2 border-blue-200 border-t-blue-500 rounded-xl animate-spin`}></div>
      </div>

      {/* Loading Text */}
      <p className={`${currentSize.text} text-gray-600 font-medium flex items-center space-x-2`}>
        <RefreshCw className="h-4 w-4 animate-spin" />
        <span>{message}</span>
      </p>

      {/* Loading Dots */}
      <div className="flex space-x-1 mt-3">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-100"></div>
        <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-200"></div>
      </div>
    </div>
  );
};

export default PageLoader;
