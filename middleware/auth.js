const jwt = require('jsonwebtoken');

// Middleware to protect routes and extract JWT from the request
exports.protect = (req, res, next) => {
  // Get the token from the Authorization header (format: Bearer <token>)
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  // If no token is provided, deny access
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Verify the token
  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded token data (e.g., user id, email) to req.user
    req.user = decoded;

    // Continue to the next middleware or the protected route handler
    next();
  } catch (error) {
    // If the token is invalid or expired, send an error response
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
