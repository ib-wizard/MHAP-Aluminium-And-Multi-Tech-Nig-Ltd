/**
 * One-time / repeatable database bootstrap script.
 *
 * Usage:
 *   node db/init.js            -> runs schema.sql + seed.sql + creates first admin
 *   node db/init.js --no-seed  -> runs schema.sql only (skip sample content)
 *
 * Safe to re-run: schema.sql uses IF NOT EXISTS / CREATE OR REPLACE everywhere,
 * seed.sql uses ON CONFLICT DO NOTHING, and the admin user is only created if
 * the admin_users table is currently empty.
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { pool } = require('../src/config/db');

async function run() {
  const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  console.log('Applying schema.sql ...');
  await pool.query(schemaSql);
  console.log('Schema applied.');

  const skipSeed = process.argv.includes('--no-seed');
  if (!skipSeed) {
    const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    console.log('Applying seed.sql ...');
    await pool.query(seedSql);
    console.log('Seed data applied.');
  }

  const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM admin_users');
  if (rows[0].count === 0) {
    const username = process.env.SEED_ADMIN_USERNAME || 'admin';
    const email = process.env.SEED_ADMIN_EMAIL || 'admin@mhapaluminum.com';
    const password = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';
    const hash = await bcrypt.hash(password, 12);

    await pool.query(
      `INSERT INTO admin_users (username, email, password_hash, role)
       VALUES ($1, $2, $3, 'superadmin')`,
      [username, email, hash]
    );

    console.log('----------------------------------------------------');
    console.log('Created first admin user:');
    console.log('  email:   ', email);
    console.log('  password:', password);
    console.log('Log in and change this password immediately.');
    console.log('----------------------------------------------------');
  } else {
    console.log('Admin users already exist, skipping admin creation.');
  }

  await pool.end();
}

run().catch((err) => {
  console.error('Database initialization failed:', err);
  process.exit(1);
});
