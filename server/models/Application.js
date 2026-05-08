const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, required: true },
  college: { type: String, required: true },
  skills: [{ type: String }],
  role: { type: String, required: true }, // e.g. Web Developer, Content Writer
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  resumePublicId: { type: String, default: '' },
  coverLetter: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'selected', 'rejected', 'completed'],
    default: 'pending',
  },
  startDate: { type: Date },
  endDate: { type: Date },
  certificateId: { type: String, default: null },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  reviewNote: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
