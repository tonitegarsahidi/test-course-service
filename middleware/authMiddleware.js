// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
    let token = req.headers['authorization'];

    console.log('Received token:', token);

    if (!token) {
        return res.status(401).json({ message: 'Authentication failed. Token is missing.' });
    }

    if (token.startsWith('Bearer ')) {
        // Remove "Bearer " prefix
        token = token.slice(7);
    }
    
    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('JWT verification error:', err);
            // Token is invalid or expired
            return res.status(403).json({ message: 'Authentication failed. Invalid token.' });
        }

        console.log("Token is VALID");

        // The token is valid
        // You can access the decoded payload here
        const userId = decoded.id;
        const userEmail = decoded.email;
        const fullName = decoded.full_name;
        const phoneNumber = decoded.phone_number;

        // Continue with your logic, such as querying the user data or performing authorized actions
        // ...

        // Optionally, you can also set the user data on the request object for future middleware or route handlers
        // For example:
        req.user = {
            id: userId,
            email: userEmail,
            full_name: fullName,
            phone_number: phoneNumber,
        };

        // Call the next middleware or route handler
        next();
    });

};

module.exports = {
    authenticateToken,
};
