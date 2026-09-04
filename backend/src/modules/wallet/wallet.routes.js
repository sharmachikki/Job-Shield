const express = require('express');
const controller = require('./wallet.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { validate } = require('../../middleware/validation.middleware');
const { createSchema, updateSchema } = require('./wallet.validation');

const router = express.Router();

// GET    /api/v1/wallet
router.get('/', authenticate, controller.list);

// GET    /api/v1/wallet/:id
router.get('/:id', authenticate, controller.getById);

// POST   /api/v1/wallet
router.post('/', authenticate, validate(createSchema), controller.create);

// PUT    /api/v1/wallet/:id
router.put('/:id', authenticate, validate(updateSchema), controller.update);

// DELETE /api/v1/wallet/:id
router.delete('/:id', authenticate, controller.remove);

module.exports = router;
