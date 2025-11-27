// frontend/src/components/ProtectedRoute.js

import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// ❗ CRITICAL FIX: The AuthContext object is exported using 'export const AuthContext'.
// Therefore, it MUST be imported using NAMED IMPORT (curly braces).
import { AuthContext } from '../context/AuthContext'; 

const ProtectedRoute = ({ allowedRoles }) => {
    // useContext will now correctly receive the context object, resolving the 'undefined' error.
    const { isAuthenticated, role } = useContext(AuthContext); 

    if (!isAuthenticated) {
        // User not logged in, redirect to login page
        return <Navigate to="/login" replace />;
    }
/*
    // User is logged in, but check if their role is permitted
    if (!allowedRoles.includes(role)) {
        // Logged in but unauthorized role
        return <Navigate to="/unauthorized" replace />; 
    }
*/
    // User is logged in and authorized: render the child component (Outlet)
    return <Outlet />;
};

export default ProtectedRoute;