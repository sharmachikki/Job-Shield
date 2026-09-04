const express = require('express');
const controller = require('./site-settings.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const { validate } = require('../../middleware/validation.middleware');
const { updateSchema } = require('./site-settings.validation');
const { ROLES } = require('../../config/constants');

const router = express.Router();

// GET /api/v1/settings/public — no auth. Powers the public site's header,
// footer, hero content, and theme colors (see docs — settings render flow).
router.get('/public', controller.getPublic);

// GET /api/v1/settings/admin — full record for the admin Settings screen.
router.get(
  '/admin',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN),
  controller.getAdmin
);

// PUT /api/v1/settings/admin — saves whichever tab the admin just edited.
router.put(
  '/admin',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN),
  validate(updateSchema),
  controller.update
);

module.exports = router;
