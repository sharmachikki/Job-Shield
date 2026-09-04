const AppError = require('../utils/AppError');

// Usage: router.get('/admin/jobs', authenticate, authorize('SUPER_ADMIN', 'OPERATIONS_ADMIN'), handler)
function authorize(...allowedRoles) {
  return (req, res, next) => {
    const userRoles = (req.user && req.user.roles) || [];
    const isAllowed = userRoles.some((r) => allowedRoles.includes(r));
    if (!isAllowed) return next(new AppError('You do not have permission to perform this action', 403));
    next();
  };
}

module.exports = { authorize };
