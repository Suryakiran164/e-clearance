// frontend/src/context/AuthContext.js

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    // ... (state and useCallback definitions for loadUserFromToken and logout) ...
    // [Assuming loadUserFromToken and logout are defined correctly as in the last response]
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem('token')); 
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setRole(null);
        navigate('/login');
    }, [navigate]);

    const loadUserFromToken = useCallback((jwtToken) => {
        try {
            const decoded = jwtDecode(jwtToken);
            if (decoded.exp * 1000 < Date.now()) {
                console.error("Token expired.");
                return logout();
            }
            setToken(jwtToken);
            setUser({ id: decoded.id, role: decoded.role });
            setRole(decoded.role);
        } catch (error) {
            console.error("Token decoding failed:", error);
            logout();
        }
    }, [logout]);
    
    useEffect(() => {
        if (token) {
            loadUserFromToken(token);
        }
        if (!token) {
            setUser(null);
            setRole(null);
        }
    }, [token, loadUserFromToken]);

    const login = (jwtToken, userRole) => {
        localStorage.setItem('token', jwtToken);
        
        // 1. CRITICAL: Ensure the role used for redirection is always lowercase
        const finalRole = userRole.toLowerCase(); 
        setToken(jwtToken); 
        
        // 2. Navigate uses the correct lowercase path
        navigate(`/${finalRole}/dashboard`);
    };

    return (
        <AuthContext.Provider value={{ user, role, token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;