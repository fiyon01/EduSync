const authLogin = require("../controllers/authcotrollers");
const express = require('express'); // Use require instead of import
const jwt = require('jsonwebtoken'); // Require jsonwebtoken
const router = express.Router();
const dotenv = require("dotenv")
dotenv.config();

// Helper function to verify JWT token and get user info
const verifyToken = (req, res, next) => {
    console.log('Headers:', req.headers); // Log all headers to see if the Authorization header exists

    // Retrieve the Authorization header from the request
    const authHeader = req.header('Authorization');
    console.log('Auth header:', authHeader); // Log the Authorization header

    // Check if the Authorization header is missing
    if (!authHeader) {
        console.log('No authorization header');
        return res.status(403).send('Access denied. No Authorization header.');
    }

    // Split the Authorization header into 'Bearer' and the token
    const token = authHeader.split(' ')[1]; // 'Bearer <token>'
    
    // Check if the token is missing after 'Bearer'
    if (!token) {
        console.log('No token found in Authorization header');
        return res.status(403).send('Access denied. No token found.');
    }

    // Verify the token using JWT secret key
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        // If token verification fails, return a 403 response with error details
        if (err) {
            console.log('Token verification failed:', err);
            return res.status(403).send('Invalid token.');
        }

        // If token is valid, attach decoded data to req.user and move to the next middleware
        console.log('Token verified successfully:', decoded);
        req.user = decoded;
        next();
    });
};


// Route for login
router.post("/auth/login", authLogin);


module.exports = router;
