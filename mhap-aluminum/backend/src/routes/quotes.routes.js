const express = require('express');
const { body, param } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { query } = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { makeUploader } = require('../middleware/upload');

const router = express.Router();
const uploadQuoteFile = makeUploader('quotes');

const publicFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: 'Too many submissions from this device. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public: submit a quote request, with an optional drawing/image attachment
router.post(
  '/',
  publicFormLimiter,
  uploadQuoteFile.single('attachment'),
  [
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('phone').trim().notEmpty().withMessage('Phone number is required.'),
    body('email').optional({ checkFalsy: true }).isEmail().withMessage('Email must be valid.'),
    body('description').trim().notEmpty().withMessage('Project description is required.'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { name, phone, email, project_type, description, budget } = req.body;
      const attachment_url = req.file ? `/uploads/quotes/${req.file.filename}` : null;

      const { rows } = await query(
        `INSERT INTO quote_requests (name, phone, email, project_type, description, budget, attachment_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
        [name, phone, email || null, project_type || null, description, budget || null, attachment_url]
      );
      return res.status(201).json({ message: 'Quote request submitted. We will contact you shortly.', request: rows[0] });
    } catch (err) {
      return next(err);
    }
  }
);

// Admin: list / filter quote requests
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { status } = req.query;
    const { rows } = await query(
      status
        ? 'SELECT * FROM quote_requests WHERE status = $1 ORDER BY created_at DESC'
        : 'SELECT * FROM quote_requests ORDER BY created_at DESC',
      status ? [status] : []
    );
    return res.json(rows);
  } catch (err) {
    return next(err);
  }
});

router.patch(
  '/:id/status',
  requireAuth,
  [
    param('id').isInt(),
    body('status').isIn(['pending', 'reviewing', 'quoted', 'completed', 'declined']),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { status, admin_notes } = req.body;
      const { rows } = await query(
        'UPDATE quote_requests SET status = $1, admin_notes = COALESCE($2, admin_notes) WHERE id = $3 RETURNING *',
        [status, admin_notes, req.params.id]
      );
      if (!rows[0]) return res.status(404).json({ error: 'Quote request not found.' });
      return res.json(rows[0]);
    } catch (err) {
      return next(err);
    }
  }
);

router.delete('/:id', requireAuth, param('id').isInt(), validate, async (req, res, next) => {
  try {
    const { rows } = await query('DELETE FROM quote_requests WHERE id = $1 RETURNING id', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Quote request not found.' });
    return res.json({ message: 'Quote request deleted.' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
