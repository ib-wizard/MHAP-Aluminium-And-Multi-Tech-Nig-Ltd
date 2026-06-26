const express = require('express');
const { body, param } = require('express-validator');
const { query } = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT * FROM testimonials WHERE is_active = TRUE ORDER BY display_order ASC, id DESC'
    );
    return res.json(rows);
  } catch (err) {
    return next(err);
  }
});

router.get('/admin', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM testimonials ORDER BY display_order ASC, id DESC');
    return res.json(rows);
  } catch (err) {
    return next(err);
  }
});

router.post(
  '/',
  requireAuth,
  [
    body('client_name').trim().notEmpty().withMessage('Client name is required.'),
    body('message').trim().notEmpty().withMessage('Message is required.'),
    body('rating').optional().isInt({ min: 1, max: 5 }),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { client_name, client_title, client_image_url, message, rating, display_order, is_active } = req.body;
      const { rows } = await query(
        `INSERT INTO testimonials (client_name, client_title, client_image_url, message, rating, display_order, is_active)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
        [client_name, client_title || null, client_image_url || null, message, rating || 5, display_order || 0, is_active !== false]
      );
      return res.status(201).json(rows[0]);
    } catch (err) {
      return next(err);
    }
  }
);

router.put('/:id', requireAuth, param('id').isInt(), validate, async (req, res, next) => {
  try {
    const { client_name, client_title, client_image_url, message, rating, display_order, is_active } = req.body;
    const { rows } = await query(
      `UPDATE testimonials SET
        client_name = COALESCE($1, client_name),
        client_title = COALESCE($2, client_title),
        client_image_url = COALESCE($3, client_image_url),
        message = COALESCE($4, message),
        rating = COALESCE($5, rating),
        display_order = COALESCE($6, display_order),
        is_active = COALESCE($7, is_active)
       WHERE id = $8 RETURNING *`,
      [client_name, client_title, client_image_url, message, rating, display_order, is_active, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Testimonial not found.' });
    return res.json(rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', requireAuth, param('id').isInt(), validate, async (req, res, next) => {
  try {
    const { rows } = await query('DELETE FROM testimonials WHERE id = $1 RETURNING id', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Testimonial not found.' });
    return res.json({ message: 'Testimonial deleted.' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
