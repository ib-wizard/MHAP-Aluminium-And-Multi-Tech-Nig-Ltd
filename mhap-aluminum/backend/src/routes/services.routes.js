const express = require('express');
const { body, param } = require('express-validator');
const slugify = require('slugify');
const { query } = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

// Public: list active services, ordered for display
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT * FROM services WHERE is_active = TRUE ORDER BY display_order ASC, id ASC'
    );
    return res.json(rows);
  } catch (err) {
    return next(err);
  }
});

// Admin: list ALL services including inactive ones, for the dashboard
router.get('/admin', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM services ORDER BY display_order ASC, id ASC');
    return res.json(rows);
  } catch (err) {
    return next(err);
  }
});

router.get('/:slug', param('slug').notEmpty(), validate, async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM services WHERE slug = $1 AND is_active = TRUE', [
      req.params.slug,
    ]);
    if (!rows[0]) return res.status(404).json({ error: 'Service not found.' });
    return res.json(rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.post(
  '/',
  requireAuth,
  [
    body('title').trim().notEmpty().withMessage('Title is required.'),
    body('short_description').optional().trim(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { title, short_description, full_description, icon, image_url, display_order, is_active } = req.body;
      const slug = slugify(title, { lower: true, strict: true });

      const { rows } = await query(
        `INSERT INTO services (title, slug, short_description, full_description, icon, image_url, display_order, is_active)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
        [title, slug, short_description || null, full_description || null, icon || 'layout-grid', image_url || null, display_order || 0, is_active !== false]
      );
      return res.status(201).json(rows[0]);
    } catch (err) {
      return next(err);
    }
  }
);

router.put('/:id', requireAuth, param('id').isInt(), validate, async (req, res, next) => {
  try {
    const { title, short_description, full_description, icon, image_url, display_order, is_active } = req.body;
    const slug = title ? slugify(title, { lower: true, strict: true }) : undefined;

    const { rows } = await query(
      `UPDATE services SET
        title = COALESCE($1, title),
        slug = COALESCE($2, slug),
        short_description = COALESCE($3, short_description),
        full_description = COALESCE($4, full_description),
        icon = COALESCE($5, icon),
        image_url = COALESCE($6, image_url),
        display_order = COALESCE($7, display_order),
        is_active = COALESCE($8, is_active)
       WHERE id = $9 RETURNING *`,
      [title, slug, short_description, full_description, icon, image_url, display_order, is_active, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Service not found.' });
    return res.json(rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', requireAuth, param('id').isInt(), validate, async (req, res, next) => {
  try {
    const { rows } = await query('DELETE FROM services WHERE id = $1 RETURNING id', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Service not found.' });
    return res.json({ message: 'Service deleted.' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
