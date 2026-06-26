const express = require('express');
const { body, param } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { query } = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

const publicFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: 'Too many messages from this device. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  '/',
  publicFormLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('A valid email is required.'),
    body('message').trim().notEmpty().withMessage('Message is required.'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { name, email, phone, subject, message } = req.body;
      const { rows } = await query(
        'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [name, email, phone || null, subject || null, message]
      );
      return res.status(201).json({ message: 'Message sent. We will get back to you shortly.', contact: rows[0] });
    } catch (err) {
      return next(err);
    }
  }
);

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    return res.json(rows);
  } catch (err) {
    return next(err);
  }
});

router.patch('/:id/read', requireAuth, param('id').isInt(), validate, async (req, res, next) => {
  try {
    const { rows } = await query(
      'UPDATE contact_messages SET is_read = TRUE WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Message not found.' });
    return res.json(rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', requireAuth, param('id').isInt(), validate, async (req, res, next) => {
  try {
    const { rows } = await query('DELETE FROM contact_messages WHERE id = $1 RETURNING id', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Message not found.' });
    return res.json({ message: 'Message deleted.' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
