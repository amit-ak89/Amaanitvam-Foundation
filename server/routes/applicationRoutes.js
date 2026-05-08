const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  getDashboardStats,
} = require('../controllers/applicationController');

// Public – submit application
router.post('/', upload.single('resume'), createApplication);

// Protected – admin routes
router.get('/stats/dashboard', protect, getDashboardStats);
router.get('/', protect, getAllApplications);
router.get('/:id', protect, getApplicationById);
router.put('/:id/status', protect, updateApplicationStatus);
router.delete('/:id', protect, deleteApplication);

module.exports = router;
