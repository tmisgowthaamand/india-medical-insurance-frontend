import React from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

/**
 * Component that automatically updates document title based on current route
 */
const TitleProvider = ({ children }) => {
  useDocumentTitle();
  return children;
};

export default TitleProvider;
