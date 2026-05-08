const Application = require('../models/Application');
const { sendStatusEmail } = require('../utils/emailService');

// @POST /api/applications
const createApplication = async (req, res, next) => {
  try {
    const { fullName, email, phone, college, skills, role, linkedin, github, coverLetter } = req.body;
    const resumeUrl = req.file ? `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${req.file.filename}` : '';
    const resumePublicId = req.file?.filename || '';

    const application = await Application.create({
      fullName, email, phone, college, skills, role, linkedin, github, coverLetter, resumeUrl, resumePublicId,
    });

    res.status(201).json({ success: true, message: 'Application submitted successfully', application });
  } catch (err) { next(err); }
};

// @GET /api/applications (Admin only)
const getAllApplications = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } },
      ];
    }

    const applications = await Application.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('reviewedBy', 'name email');

    const total = await Application.countDocuments(query);

    res.json({ success: true, applications, total, page: +page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

// @GET /api/applications/:id
const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id).populate('reviewedBy', 'name email');
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, application });
  } catch (err) { next(err); }
};

// @PUT /api/applications/:id/status
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, reviewNote, startDate, endDate } = req.body;
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    application.status = status;
    application.reviewNote = reviewNote || application.reviewNote;
    application.reviewedBy = req.admin._id;
    if (startDate) application.startDate = startDate;
    if (endDate) application.endDate = endDate;
    await application.save();

    // Send email notification (non-blocking)
    if (['selected', 'rejected', 'completed'].includes(status)) {
      sendStatusEmail({
        to: application.email,
        name: application.fullName,
        status,
        role: application.role,
      }).catch(err => console.log('Email skipped:', err.message));
    }

    res.json({ success: true, message: 'Status updated successfully', application });
  } catch (err) { next(err); }
};

// @DELETE /api/applications/:id
const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, message: 'Application deleted' });
  } catch (err) { next(err); }
};

// @GET /api/applications/stats/dashboard
const getDashboardStats = async (req, res, next) => {
  try {
    const total = await Application.countDocuments();
    const pending = await Application.countDocuments({ status: 'pending' });
    const selected = await Application.countDocuments({ status: 'selected' });
    const completed = await Application.countDocuments({ status: 'completed' });
    const rejected = await Application.countDocuments({ status: 'rejected' });

    res.json({ success: true, stats: { total, pending, selected, completed, rejected } });
  } catch (err) { next(err); }
};

module.exports = {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  getDashboardStats,
};
