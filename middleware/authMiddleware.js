const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify the JWT token
const protect = async (req, res, next) => {
  let token;

  // Check for token in the request header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode token and get user id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by id, exclude the password
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
