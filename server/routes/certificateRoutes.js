const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/auth');
const {
  generateCertificate,
  verifyCertificate,
  downloadCertificate,
  getAllCertificates,
  bulkGenerateCertificates,
} = require('../controllers/certificateController');

// CSV upload in memory for bulk generation
const csvUpload = multer({ storage: multer.memoryStorage() });

// Public routes
router.get('/verify/:certificateId', verifyCertificate);
router.get('/download/:certificateId', downloadCertificate);

// Protected admin routes
router.get('/', protect, getAllCertificates);
router.post('/generate/:applicationId', protect, generateCertificate);
router.post('/bulk', protect, csvUpload.single('csv'), bulkGenerateCertificates);

module.exports = router;
