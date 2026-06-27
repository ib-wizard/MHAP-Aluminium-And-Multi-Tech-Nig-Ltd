require('dotenv').config();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { errorHandler, notFound } = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth.routes');
const companyRoutes = require('./routes/company.routes');
const servicesRoutes = require('./routes/services.routes');
const projectsRoutes = require('./routes/projects.routes');
const galleryRoutes = require('./routes/gallery.routes');
const testimonialsRoutes = require('./routes/testimonials.routes');
const quotesRoutes = require('./routes/quotes.routes');
const contactRoutes = require('./routes/contact.routes');
const uploadRoutes = require('./routes/upload.routes');

const app = express();

app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/uploads', uploadRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`MHAP Aluminum API listening on port ${PORT} (${process.env.NODE_ENV || 'development'})`);

  // Auto-initialize database after server starts
  try {
    console.log('[DB] Starting database initialization...');
    console.log('[DB] DATABASE_URL present:', !!process.env.DATABASE_URL);

    const { pool } = require('./config/db');

    // Test connection first
    await pool.query('SELECT 1');
    console.log('[DB] Database connection successful.');

    const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
    console.log('[DB] Reading schema from:', schemaPath);
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schemaSql);
    console.log('[DB] Schema applied successfully.');

    const seedPath = path.join(__dirname, '..', 'db', 'seed.sql');
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    await pool.query(seedSql);
    console.log('[DB] Seed data applied.');

    const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM admin_users');
    console.log('[DB] Admin user count:', rows[0].count);

    if (rows[0].count === 0) {
      const username = process.env.SEED_ADMIN_USERNAME || 'admin';
      const email = process.env.SEED_ADMIN_EMAIL || 'admin@mhapaluminum.com';
      const password = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';
      const hash = await bcrypt.hash(password, 12);
      await pool.query(
        `INSERT INTO admin_users (username, email, password_hash, role) VALUES ($1, $2, $3, 'superadmin')`,
        [username, email, hash]
      );
      console.log('[DB] Admin user created:', email);
    } else {
      console.log('[DB] Admin user already exists, skipping.');
    }

    console.log('[DB] Initialization complete!');
  } catch (err) {
    console.error('[DB] INIT FAILED:', err.message);
    console.error('[DB] Full error:', err);
  }
});

module.exports = app;
