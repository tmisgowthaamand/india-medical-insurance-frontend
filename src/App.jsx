import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authAPI } from './api';
import { useDocumentTitle } from './hooks/useDocumentTitle';

// Import components
import NavBar from './components/NavBar';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';
import TitleProvider from './components/TitleProvider';
import AppLoader from './components/AppLoader';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Prediction from './pages/Prediction';
import ClaimsAnalysis from './pages/ClaimsAnalysis';
import Admin from './pages/Admin';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  return authAPI.isAuthenticated() ? children : <Navigate to="/login" />;
};

// Admin Route component
const AdminRoute = ({ children }) => {
  return authAPI.isAuthenticated() && authAPI.isAdmin() ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AppLoader>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <TitleProvider>
          <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div className="flex h-screen bg-gray-100 overflow-hidden">
                  <NavBar />
                  <main className="flex-1 overflow-y-auto lg:ml-0">
                    <Dashboard />
                  </main>
                  <ScrollToTopButton />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/prediction"
            element={
              <ProtectedRoute>
                <div className="flex h-screen bg-gray-100 overflow-hidden">
                  <NavBar />
                  <main className="flex-1 overflow-y-auto lg:ml-0">
                    <Prediction />
                  </main>
                  <ScrollToTopButton />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/claims-analysis"
            element={
              <ProtectedRoute>
                <div className="flex h-screen bg-gray-100 overflow-hidden">
                  <NavBar />
                  <main className="flex-1 overflow-y-auto lg:ml-0">
                    <ClaimsAnalysis />
                  </main>
                  <ScrollToTopButton />
                </div>
              </ProtectedRoute>
            }
          />
          
          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <div className="flex h-screen bg-gray-100 overflow-hidden">
                  <NavBar />
                  <main className="flex-1 overflow-y-auto lg:ml-0">
                    <Admin />
                  </main>
                  <ScrollToTopButton />
                </div>
              </AdminRoute>
            }
          />
          </Routes>
          </div>
        </TitleProvider>
      </Router>
    </AppLoader>
  );
}

export default App;
