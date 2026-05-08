const crypto = require('crypto');

/**
 * Generate unique certificate ID: CERT-AMAN-2026-XXXXXX
 */
const generateCertificateId = () => {
  const year = new Date().getFullYear();
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `CERT-AMAN-${year}-${random}`;
};

/**
 * Generate SHA256 hash signature for anti-fake verification
 * hash(name + email + secret_key)
 */
const generateHashSignature = (name, email) => {
  const data = `${name}${email}${process.env.CERT_SECRET_KEY}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Format date to readable string: 1st January 2026
 */
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
};

module.exports = { generateCertificateId, generateHashSignature, formatDate };
