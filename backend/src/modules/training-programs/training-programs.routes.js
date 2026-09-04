const express = require('express');
const controller = require('./training-programs.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { validate } = require('../../middleware/validation.middleware');
const { createSchema, updateSchema } = require('./training-programs.validation');

const router = express.Router();

// GET    /api/v1/training-programs
router.get('/', authenticate, controller.list);

// GET    /api/v1/training-programs/:id
router.get('/:id', authenticate, controller.getById);

// POST   /api/v1/training-programs
router.post('/', authenticate, validate(createSchema), controller.create);

// PUT    /api/v1/training-programs/:id
router.put('/:id', authenticate, validate(updateSchema), controller.update);

// DELETE /api/v1/training-programs/:id
router.delete('/:id', authenticate, controller.remove);

module.exports = router;
