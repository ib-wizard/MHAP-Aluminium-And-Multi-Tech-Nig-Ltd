const jwt = require('jsonwebtoken');

/**
 * Verifies the Bearer JWT on the Authorization header and attaches
 * the decoded admin payload to req.admin. Use on every admin-only route.
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing or malformed authorization header.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = payload; // { id, username, role }
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

/**
 * Restricts a route to one or more admin roles. Use after requireAuth.
 * Example: router.delete('/:id', requireAuth, requireRole('superadmin'), handler)
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return res.status(403).json({ error: 'You do not have permission to perform this action.' });
    }
    return next();
  };
}

module.exports = { requireAuth, requireRole };
