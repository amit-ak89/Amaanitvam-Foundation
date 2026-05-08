const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateId: { type: String, required: true, unique: true }, // CERT-AMAN-2026-XXXXXX
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  internName: { type: String, required: true },
  internEmail: { type: String, required: true },
  role: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  issueDate: { type: Date, default: Date.now },
  hashSignature: { type: String, required: true }, // SHA256 hash for anti-fake
  qrCodeUrl: { type: String },
  pdfUrl: { type: String },
  isValid: { type: Boolean, default: true },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
