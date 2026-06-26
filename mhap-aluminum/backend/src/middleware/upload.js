const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf', // for drawings attached to quote requests
]);

const maxSizeBytes = (Number(process.env.MAX_UPLOAD_MB) || 8) * 1024 * 1024;

function storageFor(subfolder) {
  const dest = path.join(__dirname, '..', '..', 'uploads', subfolder);
  fs.mkdirSync(dest, { recursive: true });

  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dest),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const safeName = crypto.randomBytes(16).toString('hex') + ext;
      cb(null, safeName);
    },
  });
}

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME.has(file.mimetype)) {
    return cb(new Error('Unsupported file type. Allowed: JPG, PNG, WEBP, GIF, PDF.'));
  }
  return cb(null, true);
}

/**
 * Returns a configured multer instance scoped to a specific uploads
 * subfolder (e.g. "projects", "gallery", "quotes", "branding").
 */
function makeUploader(subfolder) {
  return multer({
    storage: storageFor(subfolder),
    fileFilter,
    limits: { fileSize: maxSizeBytes, files: 10 },
  });
}

module.exports = { makeUploader };
