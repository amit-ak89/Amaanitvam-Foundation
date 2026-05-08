const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Protect routes – verify JWT
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select('-password');
    if (!req.admin) return res.status(401).json({ success: false, message: 'Admin not found' });
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

// Restrict to super_admin only
const superAdminOnly = (req, res, next) => {
  if (req.admin.role !== 'super_admin') {
    return res.status(403).json({ success: false, message: 'Super Admin access only' });
  }
  next();
};

module.exports = { protect, superAdminOnly };
