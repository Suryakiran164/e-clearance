// backend/middleware/authMiddleware.js (CORRECTED AND STABLE)

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. Extract token
            token = req.headers.authorization.split(' ')[1];
            
            // 2. Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // 3. Attach user data to request
            req.user = await User.findById(decoded.id).select('-password');
            req.userRole = decoded.role; 
            
            // 4. Success: Proceed to the route handler
            next(); 
            
        } catch (error) {
            // Error during verification (e.g., expired or bad token)
            console.error("Token verification failed:", error.message);
            // FIX: Use 'return' to stop execution immediately after sending the response
            return res.status(401).json({ message: 'Not authorized, token failed' }); 
        }
    }

    if (!token) {
        // No token provided in the header
        // FIX: Use 'return' here as well
        return res.status(401).json({ message: 'Not authorized, no token' }); 
    }
};

module.exports = { protect };