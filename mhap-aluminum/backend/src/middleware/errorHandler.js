const multer = require('multer');

/**
 * Centralized error handler. Keep this registered LAST in server.js,
 * after all routes, so any thrown/forwarded error lands here.
 */
function errorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }

  if (err.message && err.message.startsWith('Unsupported file type')) {
    return res.status(400).json({ error: err.message });
  }

  // Postgres unique_violation
  if (err.code === '23505') {
    return res.status(409).json({ error: 'A record with these details already exists.' });
  }

  console.error('Unhandled error:', err);
  const status = err.status || 500;
  return res.status(status).json({
    error: status === 500 ? 'Something went wrong on our end. Please try again.' : err.message,
  });
}

function notFound(req, res) {
  res.status(404).json({ error: 'Resource not found.' });
}

module.exports = { errorHandler, notFound };
