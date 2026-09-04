const jwt = require('jsonwebtoken');
const env = require('../config/environment');
const AppError = require('../utils/AppError');

// Verifies the JWT access token and attaches { id, roles } to req.user
function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return next(new AppError('Authentication token missing', 401));

  try {
    const payload = jwt.verify(token, env.jwt.accessSecret);
    req.user = payload; // { id, roles: [...] }
    next();
  } catch (err) {
    next(new AppError('Invalid or expired token', 401));
  }
}

module.exports = { authenticate };
