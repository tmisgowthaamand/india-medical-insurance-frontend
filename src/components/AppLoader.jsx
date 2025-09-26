import React, { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';

const AppLoader = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = sessionStorage.getItem('medicare_visited');
    
    if (hasVisited) {
      // Skip loading screen for subsequent visits in the same session
      setIsLoading(false);
      setShowApp(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    // Mark as visited for this session
    sessionStorage.setItem('medicare_visited', 'true');
    
    // Add a small delay for smooth transition
    setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        setShowApp(true);
      }, 300);
    }, 500);
  };

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <div className={`transition-opacity duration-500 ${showApp ? 'opacity-100' : 'opacity-0'}`}>
      {children}
    </div>
  );
};

export default AppLoader;
