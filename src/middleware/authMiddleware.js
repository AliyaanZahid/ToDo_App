import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');  // Extract token from the header
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided' });  // Return JSON error
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });  // Return JSON error
        }
        req.user = decoded;  // Store the decoded user data in the request
        next();  // Proceed to the next middleware or route handler
    });
}

export default authMiddleware;
