const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    // Ensure user exists, has a password, and password matches
    if (user && user.password && (await user.matchPassword(password))) {
        
        // CRITICAL FIX: Ensure the role is always lowercase for the client and JWT
        const userRole = user.role ? user.role.toLowerCase() : 'unknown';

        res.json({
            _id: user._id,
            name: user.name,
            username: user.username,
            role: userRole, // Sends lowercase role (e.g., 'proctor') to client
            token: generateToken(user._id, userRole), // JWT uses lowercase role
        });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

module.exports = router;