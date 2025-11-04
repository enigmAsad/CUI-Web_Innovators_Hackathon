// verifyToken.js
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    let token = req.cookies?.token;
    if (!token) {
        const authHeader = req.headers?.authorization || req.headers?.Authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
    }

    console.log("Cookies:", req.cookies); // Verify cookies object
    console.log("Auth header:", req.headers?.authorization); // Verify header value
    console.log("Token:", token); // Verify token value

    if (!token) {
        console.log("No token found in cookies or headers.");
        return res.status(403).json({ message: "Access Denied, token missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userId = decoded.id; // Sets userId based on token payload
        req.userRole = decoded.role;
        console.log("Token verified successfully. User ID:", req.userId);
        next();
    } catch (err) {
        console.error("Error verifying token:", err.message);
        res.status(401).json({ message: "Invalid Token", error: err.message });
    }
};

