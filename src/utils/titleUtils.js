// Utility functions for managing document title and branding

const BASE_TITLE = "MediCare+";
const TAGLINE = "AI-Powered Medical Insurance";

// Page-specific titles
const PAGE_TITLES = {
  '/': `${BASE_TITLE} | ${TAGLINE}`,
  '/login': `Login | ${BASE_TITLE}`,
  '/signup': `Sign Up | ${BASE_TITLE}`,
  '/dashboard': `Dashboard | ${BASE_TITLE}`,
  '/prediction': `AI Prediction | ${BASE_TITLE}`,
  '/claims-analysis': `Claims Analytics | ${BASE_TITLE}`,
  '/admin': `Admin Panel | ${BASE_TITLE}`,
};

/**
 * Update the document title based on the current route
 * @param {string} pathname - The current route pathname
 * @param {string} customTitle - Optional custom title to override default
 */
export const updateDocumentTitle = (pathname, customTitle = null) => {
  if (customTitle) {
    document.title = `${customTitle} | ${BASE_TITLE}`;
    return;
  }

  const title = PAGE_TITLES[pathname] || `${BASE_TITLE} | ${TAGLINE}`;
  document.title = title;
};

/**
 * Set a custom title for specific actions or states
 * @param {string} title - The custom title
 * @param {boolean} includeBase - Whether to include the base title
 */
export const setCustomTitle = (title, includeBase = true) => {
  document.title = includeBase ? `${title} | ${BASE_TITLE}` : title;
};

/**
 * Reset to default title
 */
export const resetTitle = () => {
  document.title = `${BASE_TITLE} | ${TAGLINE}`;
};

/**
 * Update title with loading state
 * @param {string} action - The action being performed
 */
export const setLoadingTitle = (action) => {
  document.title = `${action}... | ${BASE_TITLE}`;
};

export default {
  updateDocumentTitle,
  setCustomTitle,
  resetTitle,
  setLoadingTitle,
  BASE_TITLE,
  TAGLINE
};
