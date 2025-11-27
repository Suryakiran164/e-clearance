// backend/middleware/roleMiddleware.js

const authorize = (allowedRoles) => (req, res, next) => {
    // req.userRole is guaranteed to be lowercase now if token generation is correct
    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
        return res.status(403).json({ 
            message: `Access denied. Role "${req.userRole}" is not permitted to access this resource.` 
        });
    }
    next();
};

module.exports = { authorize };