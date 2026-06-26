const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { query } = require('../config/db');
const { validate } = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Slow down brute-force login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  '/login',
  loginLimiter,
  [
    body('email').isEmail().withMessage('A valid email is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { rows } = await query(
        'SELECT * FROM admin_users WHERE email = $1 AND is_active = TRUE',
        [email.toLowerCase()]
      );
      const user = rows[0];

      // Always run bcrypt.compare (even on a dummy hash) so login timing
      // doesn't reveal whether the email exists.
      const hashToCheck = user ? user.password_hash : '$2a$12$invalidinvalidinvalidinvalidinvalidinva';
      const valid = await bcrypt.compare(password, hashToCheck);

      if (!user || !valid) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
      );

      await query('UPDATE admin_users SET last_login_at = now() WHERE id = $1', [user.id]);

      return res.json({
        token,
        admin: { id: user.id, username: user.username, email: user.email, role: user.role },
      });
    } catch (err) {
      return next(err);
    }
  }
);

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT id, username, email, role, last_login_at FROM admin_users WHERE id = $1',
      [req.admin.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Admin not found.' });
    return res.json(rows[0]);
  } catch (err) {
    return next(err);
  }
});

router.post(
  '/change-password',
  requireAuth,
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters.'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const { rows } = await query('SELECT * FROM admin_users WHERE id = $1', [req.admin.id]);
      const user = rows[0];

      const valid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!valid) return res.status(401).json({ error: 'Current password is incorrect.' });

      const newHash = await bcrypt.hash(newPassword, 12);
      await query('UPDATE admin_users SET password_hash = $1 WHERE id = $2', [newHash, user.id]);

      return res.json({ message: 'Password updated successfully.' });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
