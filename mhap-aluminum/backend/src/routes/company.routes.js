const express = require('express');
const { body } = require('express-validator');
const { query } = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

// Public: anyone can read the company profile (used to render the whole site)
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM company_profile WHERE id = 1');
    return res.json(rows[0] || {});
  } catch (err) {
    return next(err);
  }
});

const updatableFields = [
  'company_name', 'slogan', 'logo_url', 'about_text', 'mission', 'vision', 'core_values',
  'hero_heading', 'hero_subheading', 'hero_image_url', 'banner_image_url',
  'stat_projects_completed', 'stat_happy_clients', 'stat_years_experience', 'stat_team_size',
  'phone', 'whatsapp', 'email', 'address', 'map_embed_url',
  'facebook_url', 'instagram_url', 'tiktok_url', 'linkedin_url',
  'primary_color', 'secondary_color', 'accent_color',
];

// Admin: partial update of any of the fields above
router.put(
  '/',
  requireAuth,
  [body('email').optional({ checkFalsy: true }).isEmail().withMessage('Email must be valid.')],
  validate,
  async (req, res, next) => {
    try {
      const sets = [];
      const values = [];
      let i = 1;

      for (const field of updatableFields) {
        if (Object.prototype.hasOwnProperty.call(req.body, field)) {
          sets.push(`${field} = $${i}`);
          values.push(req.body[field]);
          i += 1;
        }
      }

      if (sets.length === 0) {
        return res.status(400).json({ error: 'No valid fields provided to update.' });
      }

      const sql = `UPDATE company_profile SET ${sets.join(', ')} WHERE id = 1 RETURNING *`;
      const { rows } = await query(sql, values);
      return res.json(rows[0]);
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
