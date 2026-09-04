const express = require('express');
const controller = require('./messages.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { validate } = require('../../middleware/validation.middleware');
const { createSchema, updateSchema } = require('./messages.validation');

const router = express.Router();

// GET    /api/v1/messages
router.get('/', authenticate, controller.list);

// GET    /api/v1/messages/:id
router.get('/:id', authenticate, controller.getById);

// POST   /api/v1/messages
router.post('/', authenticate, validate(createSchema), controller.create);

// PUT    /api/v1/messages/:id
router.put('/:id', authenticate, validate(updateSchema), controller.update);

// DELETE /api/v1/messages/:id
router.delete('/:id', authenticate, controller.remove);

module.exports = router;
