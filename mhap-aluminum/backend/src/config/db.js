const { Pool } = require('pg');
require('dotenv').config();

// Supports either a single DATABASE_URL (common with managed Postgres hosts
// like Render, Railway, Supabase, RDS) or discrete PG* env vars.
const useConnectionString = !!process.env.DATABASE_URL;

const sslEnabled = String(process.env.PGSSL).toLowerCase() === 'true';

const pool = new Pool(
  useConnectionString
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: sslEnabled ? { rejectUnauthorized: false } : false,
      }
    : {
        host: process.env.PGHOST || 'localhost',
        port: Number(process.env.PGPORT) || 5432,
        database: process.env.PGDATABASE || 'mhap_aluminum',
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || '',
        ssl: sslEnabled ? { rejectUnauthorized: false } : false,
      }
);

pool.on('error', (err) => {
  // Prevents an idle client error from crashing the whole process
  console.error('Unexpected PostgreSQL pool error:', err.message);
});

/**
 * Thin query helper. Always use parameterized queries ($1, $2, ...)
 * with this helper - never string-concatenate user input into SQL.
 */
async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  if (process.env.NODE_ENV !== 'production') {
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
  }
  return res;
}

module.exports = { pool, query };
