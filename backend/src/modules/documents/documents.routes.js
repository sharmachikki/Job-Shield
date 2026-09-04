const express = require('express');
const controller = require('./documents.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { validate } = require('../../middleware/validation.middleware');
const { createSchema, updateSchema } = require('./documents.validation');

const router = express.Router();

// GET    /api/v1/documents
router.get('/', authenticate, controller.list);

// GET    /api/v1/documents/:id
router.get('/:id', authenticate, controller.getById);

// POST   /api/v1/documents
router.post('/', authenticate, validate(createSchema), controller.create);

// PUT    /api/v1/documents/:id
router.put('/:id', authenticate, validate(updateSchema), controller.update);

// DELETE /api/v1/documents/:id
router.delete('/:id', authenticate, controller.remove);

module.exports = router;
