import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // Authentication logic will be refined in Phase 3 with actual JWT check
    const isAuthenticated = localStorage.getItem('access_token') !== null;

    // For development, we might want to bypass this or check a mock state
    // const isAuthenticated = true; 

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
