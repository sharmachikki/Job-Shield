const express = require('express');
const controller = require('./reviews.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { validate } = require('../../middleware/validation.middleware');
const { createSchema, updateSchema } = require('./reviews.validation');

const router = express.Router();

// GET    /api/v1/reviews
router.get('/', authenticate, controller.list);

// GET    /api/v1/reviews/:id
router.get('/:id', authenticate, controller.getById);

// POST   /api/v1/reviews
router.post('/', authenticate, validate(createSchema), controller.create);

// PUT    /api/v1/reviews/:id
router.put('/:id', authenticate, validate(updateSchema), controller.update);

// DELETE /api/v1/reviews/:id
router.delete('/:id', authenticate, controller.remove);

module.exports = router;
