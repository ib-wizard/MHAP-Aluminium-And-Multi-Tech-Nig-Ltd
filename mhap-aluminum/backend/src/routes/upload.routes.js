const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { makeUploader } = require('../middleware/upload');

const router = express.Router();
const uploadBranding = makeUploader('branding');

/**
 * Generic single-image upload for branding assets: logo, hero image,
 * homepage banner. Returns the public URL to store on company_profile.
 */
router.post('/branding', requireAuth, uploadBranding.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded.' });
  return res.status(201).json({ url: `/uploads/branding/${req.file.filename}` });
});

module.exports = router;
