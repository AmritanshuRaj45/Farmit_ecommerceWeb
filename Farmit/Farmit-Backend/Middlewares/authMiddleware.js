const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware for JWT verification (used for protected routes)
function verifyToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send('Access Denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach the user data to the request object
        next(); // Proceed to the next middleware/route
    } catch (err) {
        return res.status(400).send('Invalid or expired token.');
    }
}

module.exports = verifyToken;
