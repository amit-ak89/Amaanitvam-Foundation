const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// @POST /api/auth/signup
const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });

    const admin = await Admin.create({ name, email, password, role });
    res.status(201).json({
      success: true,
      token: generateToken(admin._id),
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (err) { next(err); }
};

// @POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    res.json({
      success: true,
      token: generateToken(admin._id),
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (err) { next(err); }
};

// @GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ success: true, admin: req.admin });
};

module.exports = { signup, login, getMe };
