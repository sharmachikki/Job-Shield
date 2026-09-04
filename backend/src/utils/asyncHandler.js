// Wraps async controller functions so thrown errors reach error.middleware.js
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
