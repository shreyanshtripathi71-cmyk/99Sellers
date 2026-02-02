const db = require('../models');

// middleware/auth.js
const jwt = require('jsonwebtoken');

exports.isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key-for-testing');
    const user = await db.UserLogin.findByPk(decoded.id);

    if (user && user.UserType === 'Admin') {
      req.user = decoded;
      next();
    } else {
      res.status(403).json({ message: "Access denied. Admins only." });
    }
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};