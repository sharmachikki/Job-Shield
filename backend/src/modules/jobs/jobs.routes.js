const express = require('express');
const controller = require('./jobs.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { validate } = require('../../middleware/validation.middleware');
const { createSchema, updateSchema } = require('./jobs.validation');

const router = express.Router();

// GET    /api/v1/jobs
router.get('/', authenticate, controller.list);

// GET    /api/v1/jobs/:id
router.get('/:id', authenticate, controller.getById);

// POST   /api/v1/jobs
router.post('/', authenticate, validate(createSchema), controller.create);

// PUT    /api/v1/jobs/:id
router.put('/:id', authenticate, validate(updateSchema), controller.update);

// DELETE /api/v1/jobs/:id
router.delete('/:id', authenticate, controller.remove);

module.exports = router;
