import React from 'react';
import { Heart, Shield, Activity } from 'lucide-react';

const Logo = ({ size = 'medium', showText = true, className = '', onDark = false }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const textSizeClasses = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl',
    xl: 'text-3xl'
  };

  const iconSizeClasses = {
    small: 'h-3 w-3',
    medium: 'h-4 w-4',
    large: 'h-5 w-5',
    xl: 'h-6 w-6'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} relative flex items-center justify-center bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-xl shadow-lg`}>
        {/* Background pattern */}
        <div className="absolute inset-0 bg-white/10 rounded-xl"></div>
        
        {/* Main Shield Icon */}
        <div className="relative z-10 flex items-center justify-center">
          <Shield className={`${iconSizeClasses[size]} text-white absolute`} />
          <Heart className={`${iconSizeClasses[size]} text-white/80 absolute transform translate-x-0.5 translate-y-0.5`} />
        </div>
        
        {/* Pulse animation */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 animate-pulse opacity-20"></div>
      </div>

      {/* Company Name */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizeClasses[size]} font-bold ${onDark ? 'text-white' : 'text-blue-700'} leading-tight drop-shadow-sm`}>
            MediCare+
          </h1>
          <p className={`text-xs ${onDark ? 'text-white/80' : 'text-gray-600'} font-medium tracking-wide`}>
            Insurance Solutions
          </p>
        </div>
      )}
    </div>
  );
};

// Alternative logo variant with different styling
export const LogoVariant = ({ size = 'medium', showText = true, className = '', variant = 'primary', onDark = false }) => {
  const variants = {
    primary: 'from-blue-500 via-cyan-500 to-teal-500',
    medical: 'from-red-500 via-pink-500 to-rose-500',
    success: 'from-green-500 via-emerald-500 to-teal-500',
    professional: 'from-indigo-500 via-purple-500 to-blue-500'
  };

  const textVariants = {
    primary: 'text-blue-700',
    medical: 'text-red-700',
    success: 'text-green-700',
    professional: 'text-indigo-700'
  };

  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const textSizeClasses = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl',
    xl: 'text-3xl'
  };

  const iconSizeClasses = {
    small: 'h-3 w-3',
    medium: 'h-4 w-4',
    large: 'h-5 w-5',
    xl: 'h-6 w-6'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} relative flex items-center justify-center bg-gradient-to-br ${variants[variant]} rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-200`}>
        {/* Medical Cross Background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1/2 h-1 bg-white/20 rounded-full"></div>
          <div className="absolute w-1 h-1/2 bg-white/20 rounded-full"></div>
        </div>
        
        {/* Icons */}
        <div className="relative z-10 flex items-center justify-center">
          <Shield className={`${iconSizeClasses[size]} text-white`} />
          <Activity className={`${iconSizeClasses[size]} text-white/70 absolute transform translate-x-0.5 translate-y-0.5`} />
        </div>
      </div>

      {/* Company Name */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizeClasses[size]} font-bold ${onDark ? 'text-white' : textVariants[variant]} leading-tight drop-shadow-sm`}>
            HealthGuard
          </h1>
          <p className={`text-xs ${onDark ? 'text-white/80' : 'text-gray-600'} font-medium tracking-wide`}>
            Medical Insurance
          </p>
        </div>
      )}
    </div>
  );
};

// Compact logo for navigation
export const CompactLogo = ({ className = '' }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="w-8 h-8 relative flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-md">
        <Shield className="h-4 w-4 text-white" />
        <Heart className="h-3 w-3 text-white/80 absolute transform translate-x-0.5 translate-y-0.5" />
      </div>
      <span className="text-lg font-bold text-white drop-shadow-sm">
        MediCare+
      </span>
    </div>
  );
};

export default Logo;
