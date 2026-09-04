const express = require('express');
const controller = require('./profiles.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { validate } = require('../../middleware/validation.middleware');
const { createSchema, updateSchema } = require('./profiles.validation');

const router = express.Router();

// GET    /api/v1/profiles
router.get('/', authenticate, controller.list);

// GET    /api/v1/profiles/:id
router.get('/:id', authenticate, controller.getById);

// POST   /api/v1/profiles
router.post('/', authenticate, validate(createSchema), controller.create);

// PUT    /api/v1/profiles/:id
router.put('/:id', authenticate, validate(updateSchema), controller.update);

// DELETE /api/v1/profiles/:id
router.delete('/:id', authenticate, controller.remove);

module.exports = router;
