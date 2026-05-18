import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import History from './pages/History';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

const Layout = ({ children }) => (
  <div className="min-h-screen bg-dark-darker">
    <Navbar />
    <main className="pt-24 pb-20 md:pb-8">
      {children}
    </main>
  </div>
);

import { ToastProvider } from './ToastContext';

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen bg-dark-darker text-white">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout><Dashboard /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <Layout><Upload /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <Layout><History /></Layout>
                </ProtectedRoute>
              }
            />

            {/* Catch-all Redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
