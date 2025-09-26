import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { updateDocumentTitle } from '../utils/titleUtils';

/**
 * Custom hook to automatically update document title based on current route
 * @param {string} customTitle - Optional custom title to override default
 */
export const useDocumentTitle = (customTitle = null) => {
  const location = useLocation();

  useEffect(() => {
    updateDocumentTitle(location.pathname, customTitle);
  }, [location.pathname, customTitle]);
};

/**
 * Hook for setting a static custom title
 * @param {string} title - The title to set
 */
export const useCustomTitle = (title) => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = title;

    // Cleanup: restore original title when component unmounts
    return () => {
      document.title = originalTitle;
    };
  }, [title]);
};

export default useDocumentTitle;
