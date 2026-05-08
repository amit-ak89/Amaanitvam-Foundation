const Certificate = require('../models/Certificate');
const Application = require('../models/Application');
const { generateCertificateId, generateHashSignature } = require('../utils/certUtils');
const { generateCertificatePDF } = require('../utils/pdfGenerator');
const { sendCertificateEmail } = require('../utils/emailService');
const csv = require('csv-parser');
const { Readable } = require('stream');

/**
 * Generate certificate for a single completed application
 * @POST /api/certificates/generate/:applicationId
 */
const generateCertificate = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.applicationId);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    if (application.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Application must be marked as completed first' });
    }
    if (application.certificateId) {
      return res.status(400).json({ success: false, message: 'Certificate already generated for this application' });
    }

    const certificateId = generateCertificateId();
    const hashSignature = generateHashSignature(application.fullName, application.email);

    // Generate PDF
    const pdfBuffer = await generateCertificatePDF({
      internName: application.fullName,
      role: application.role,
      startDate: application.startDate,
      endDate: application.endDate,
      issueDate: new Date(),
      certificateId,
    });

    // Save certificate to DB
    const certificate = await Certificate.create({
      certificateId,
      applicationId: application._id,
      internName: application.fullName,
      internEmail: application.email,
      role: application.role,
      startDate: application.startDate,
      endDate: application.endDate,
      hashSignature,
      generatedBy: req.admin._id,
    });

    // Link certificate to application
    application.certificateId = certificateId;
    await application.save();

    // Send email with PDF (non-blocking)
    sendCertificateEmail({
      to: application.email,
      name: application.fullName,
      certificateId,
      pdfBuffer,
    }).catch(err => console.log('Certificate email skipped:', err.message));

    res.json({ success: true, message: 'Certificate generated and emailed successfully', certificate });
  } catch (err) { next(err); }
};

/**
 * Verify certificate by ID (public route)
 * @GET /api/certificates/verify/:certificateId
 */
const verifyCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.certificateId });
    if (!certificate || !certificate.isValid) {
      return res.status(404).json({ success: false, valid: false, message: 'INVALID CERTIFICATE' });
    }

    // Re-verify hash signature
    const expectedHash = generateHashSignature(certificate.internName, certificate.internEmail);
    if (expectedHash !== certificate.hashSignature) {
      return res.status(400).json({ success: false, valid: false, message: 'CERTIFICATE TAMPERED – INVALID' });
    }

    res.json({
      success: true,
      valid: true,
      message: 'VERIFIED CERTIFICATE',
      certificate: {
        certificateId: certificate.certificateId,
        internName: certificate.internName,
        role: certificate.role,
        startDate: certificate.startDate,
        endDate: certificate.endDate,
        issueDate: certificate.issueDate,
      },
    });
  } catch (err) { next(err); }
};

/**
 * Download certificate PDF
 * @GET /api/certificates/download/:certificateId
 */
const downloadCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.certificateId })
      .populate('applicationId');
    if (!certificate) return res.status(404).json({ success: false, message: 'Certificate not found' });

    const pdfBuffer = await generateCertificatePDF({
      internName: certificate.internName,
      role: certificate.role,
      startDate: certificate.startDate,
      endDate: certificate.endDate,
      issueDate: certificate.issueDate,
      certificateId: certificate.certificateId,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Certificate-${certificate.certificateId}.pdf`);
    res.send(pdfBuffer);
  } catch (err) { next(err); }
};

/**
 * Get all certificates (Admin)
 * @GET /api/certificates
 */
const getAllCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find().sort({ createdAt: -1 }).populate('generatedBy', 'name');
    res.json({ success: true, certificates });
  } catch (err) { next(err); }
};

/**
 * Bulk generate certificates from CSV upload
 * CSV columns: fullName, email, role, startDate, endDate
 * @POST /api/certificates/bulk
 */
const bulkGenerateCertificates = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'CSV file required' });

    const results = [];
    const stream = Readable.from(req.file.buffer.toString());

    await new Promise((resolve, reject) => {
      stream.pipe(csv())
        .on('data', (row) => results.push(row))
        .on('end', resolve)
        .on('error', reject);
    });

    const generated = [];
    for (const row of results) {
      const { fullName, email, role, startDate, endDate } = row;
      if (!fullName || !email || !role || !startDate || !endDate) continue;

      const certificateId = generateCertificateId();
      const hashSignature = generateHashSignature(fullName, email);

      const cert = await Certificate.create({
        certificateId,
        applicationId: null,
        internName: fullName,
        internEmail: email,
        role,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        hashSignature,
        generatedBy: req.admin._id,
      });

      // Generate and email PDF
      const pdfBuffer = await generateCertificatePDF({
        internName: fullName, role,
        startDate: new Date(startDate), endDate: new Date(endDate),
        issueDate: new Date(), certificateId,
      });

      await sendCertificateEmail({ to: email, name: fullName, certificateId, pdfBuffer });
      generated.push(cert);
    }

    res.json({ success: true, message: `${generated.length} certificates generated and emailed`, generated });
  } catch (err) { next(err); }
};

module.exports = {
  generateCertificate,
  verifyCertificate,
  downloadCertificate,
  getAllCertificates,
  bulkGenerateCertificates,
};
