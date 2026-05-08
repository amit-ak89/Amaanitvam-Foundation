const multer = require('multer');
const path = require('path');

const hasCloudinary =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name';

let upload;

if (hasCloudinary) {
  // ✅ Cloudinary storage — use when credentials are set
  const cloudinary = require('cloudinary').v2;
  const { CloudinaryStorage } = require('multer-storage-cloudinary');

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'amaanitvam/resumes',
      allowed_formats: ['pdf', 'doc', 'docx'],
      resource_type: 'raw',
    },
  });

  upload = multer({ storage });
  console.log('☁️  Cloudinary storage active');
} else {
  // 📁 Local disk storage — fallback when Cloudinary not configured
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
    filename: (req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
      cb(null, unique + path.extname(file.originalname));
    },
  });

  upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowed = ['.pdf', '.doc', '.docx'];
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowed.includes(ext)) cb(null, true);
      else cb(new Error('Only PDF, DOC, DOCX allowed'));
    },
  });

  console.log('📁 Local disk storage active (set Cloudinary in .env for production)');
}

module.exports = { upload };
