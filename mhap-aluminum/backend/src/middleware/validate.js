const { validationResult } = require('express-validator');

/**
 * Drop this after a chain of express-validator checks to short-circuit
 * with a 422 if any of them failed, instead of repeating the check in
 * every route handler.
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: 'Validation failed.', details: errors.array() });
  }
  return next();
}

module.exports = { validate };
