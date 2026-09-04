const express = require('express');
const controller = require('./vendors.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { validate } = require('../../middleware/validation.middleware');
const { createSchema, updateSchema } = require('./vendors.validation');

const router = express.Router();

// GET    /api/v1/vendors
router.get('/', authenticate, controller.list);

// GET    /api/v1/vendors/:id
router.get('/:id', authenticate, controller.getById);

// POST   /api/v1/vendors
router.post('/', authenticate, validate(createSchema), controller.create);

// PUT    /api/v1/vendors/:id
router.put('/:id', authenticate, validate(updateSchema), controller.update);

// DELETE /api/v1/vendors/:id
router.delete('/:id', authenticate, controller.remove);

module.exports = router;
