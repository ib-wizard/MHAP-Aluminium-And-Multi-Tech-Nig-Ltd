const express = require('express');
const { body, param } = require('express-validator');
const slugify = require('slugify');
const { query, pool } = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { makeUploader } = require('../middleware/upload');

const router = express.Router();
const uploadProjectImages = makeUploader('projects');

// Public: list published projects with filtering, category and search support
router.get('/', async (req, res, next) => {
  try {
    const { category, search, page = 1, pageSize = 12 } = req.query;
    const conditions = ['is_published = TRUE'];
    const values = [];
    let i = 1;

    if (category) {
      conditions.push(`category = $${i}`);
      values.push(category);
      i += 1;
    }
    if (search) {
      conditions.push(`(title ILIKE $${i} OR client_name ILIKE $${i} OR location ILIKE $${i})`);
      values.push(`%${search}%`);
      i += 1;
    }

    const limit = Math.min(Number(pageSize) || 12, 50);
    const offset = (Math.max(Number(page) || 1, 1) - 1) * limit;

    const { rows } = await query(
      `SELECT * FROM projects WHERE ${conditions.join(' AND ')}
       ORDER BY is_featured DESC, project_date DESC NULLS LAST, id DESC
       LIMIT $${i} OFFSET $${i + 1}`,
      [...values, limit, offset]
    );

    const { rows: countRows } = await query(
      `SELECT COUNT(*)::int AS count FROM projects WHERE ${conditions.join(' AND ')}`,
      values
    );

    return res.json({ items: rows, total: countRows[0].count, page: Number(page), pageSize: limit });
  } catch (err) {
    return next(err);
  }
});

// Public: distinct categories, used to build gallery filter chips
router.get('/categories', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT DISTINCT category FROM projects WHERE category IS NOT NULL AND is_published = TRUE ORDER BY category`
    );
    return res.json(rows.map((r) => r.category));
  } catch (err) {
    return next(err);
  }
});

router.get('/:slug', param('slug').notEmpty(), validate, async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM projects WHERE slug = $1 AND is_published = TRUE', [
      req.params.slug,
    ]);
    if (!rows[0]) return res.status(404).json({ error: 'Project not found.' });

    const { rows: images } = await query(
      'SELECT * FROM project_images WHERE project_id = $1 ORDER BY display_order ASC, id ASC',
      [rows[0].id]
    );

    return res.json({ ...rows[0], images });
  } catch (err) {
    return next(err);
  }
});

// Admin: full list (including unpublished) for the dashboard table
router.get('/admin/all', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM projects ORDER BY id DESC');
    return res.json(rows);
  } catch (err) {
    return next(err);
  }
});

router.post(
  '/',
  requireAuth,
  [body('title').trim().notEmpty().withMessage('Title is required.')],
  validate,
  async (req, res, next) => {
    try {
      const { title, client_name, location, category, project_date, description, cover_image_url, is_featured, is_published } = req.body;
      const slug = slugify(title, { lower: true, strict: true }) + '-' + Date.now().toString(36);

      const { rows } = await query(
        `INSERT INTO projects (title, slug, client_name, location, category, project_date, description, cover_image_url, is_featured, is_published)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
        [title, slug, client_name || null, location || null, category || null, project_date || null,
         description || null, cover_image_url || null, !!is_featured, is_published !== false]
      );
      return res.status(201).json(rows[0]);
    } catch (err) {
      return next(err);
    }
  }
);

router.put('/:id', requireAuth, param('id').isInt(), validate, async (req, res, next) => {
  try {
    const { title, client_name, location, category, project_date, description, cover_image_url, is_featured, is_published } = req.body;

    const { rows } = await query(
      `UPDATE projects SET
        title = COALESCE($1, title),
        client_name = COALESCE($2, client_name),
        location = COALESCE($3, location),
        category = COALESCE($4, category),
        project_date = COALESCE($5, project_date),
        description = COALESCE($6, description),
        cover_image_url = COALESCE($7, cover_image_url),
        is_featured = COALESCE($8, is_featured),
        is_published = COALESCE($9, is_published)
       WHERE id = $10 RETURNING *`,
      [title, client_name, location, category, project_date, description, cover_image_url, is_featured, is_published, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Project not found.' });
    return res.json(rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.delete('/:id', requireAuth, param('id').isInt(), validate, async (req, res, next) => {
  try {
    const { rows } = await query('DELETE FROM projects WHERE id = $1 RETURNING id', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Project not found.' });
    return res.json({ message: 'Project deleted.' });
  } catch (err) {
    return next(err);
  }
});

// Upload one or more images for a project gallery (admin only)
router.post(
  '/:id/images',
  requireAuth,
  param('id').isInt(),
  validate,
  uploadProjectImages.array('images', 10),
  async (req, res, next) => {
    const client = await pool.connect();
    try {
      const projectId = req.params.id;
      const files = req.files || [];
      if (files.length === 0) return res.status(400).json({ error: 'No images uploaded.' });

      await client.query('BEGIN');
      const inserted = [];
      for (const [idx, file] of files.entries()) {
        const url = `/uploads/projects/${file.filename}`;
        const { rows } = await client.query(
          `INSERT INTO project_images (project_id, image_url, display_order) VALUES ($1,$2,$3) RETURNING *`,
          [projectId, url, idx]
        );
        inserted.push(rows[0]);
      }
      await client.query('COMMIT');
      return res.status(201).json(inserted);
    } catch (err) {
      await client.query('ROLLBACK');
      return next(err);
    } finally {
      client.release();
    }
  }
);

router.delete('/images/:imageId', requireAuth, param('imageId').isInt(), validate, async (req, res, next) => {
  try {
    const { rows } = await query('DELETE FROM project_images WHERE id = $1 RETURNING id', [req.params.imageId]);
    if (!rows[0]) return res.status(404).json({ error: 'Image not found.' });
    return res.json({ message: 'Image deleted.' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
