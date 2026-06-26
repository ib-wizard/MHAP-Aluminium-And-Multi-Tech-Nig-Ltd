const express = require('express');
const { param } = require('express-validator');
const { query } = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { makeUploader } = require('../middleware/upload');

const router = express.Router();
const uploadGallery = makeUploader('gallery');

router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;
    const { rows } = await query(
      category
        ? 'SELECT * FROM gallery_images WHERE category = $1 ORDER BY display_order ASC, id DESC'
        : 'SELECT * FROM gallery_images ORDER BY display_order ASC, id DESC',
      category ? [category] : []
    );
    return res.json(rows);
  } catch (err) {
    return next(err);
  }
});

router.post('/', requireAuth, uploadGallery.array('images', 10), async (req, res, next) => {
  try {
    const files = req.files || [];
    if (files.length === 0) return res.status(400).json({ error: 'No images uploaded.' });

    const { title, category } = req.body;
    const inserted = [];
    for (const file of files) {
      const url = `/uploads/gallery/${file.filename}`;
      const { rows } = await query(
        'INSERT INTO gallery_images (title, category, image_url) VALUES ($1,$2,$3) RETURNING *',
        [title || null, category || null, url]
      );
      inserted.push(rows[0]);
    }
    return res.status(201).json(inserted);
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', requireAuth, param('id').isInt(), validate, async (req, res, next) => {
  try {
    const { rows } = await query('DELETE FROM gallery_images WHERE id = $1 RETURNING id', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Image not found.' });
    return res.json({ message: 'Image deleted.' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
