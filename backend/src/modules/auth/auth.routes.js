const express = require('express');
const controller = require('./auth.controller');
const { validate } = require('../../middleware/validation.middleware');
const { registerSchema, loginSchema } = require('./auth.validation');

const router = express.Router();

router.post('/register', validate(registerSchema), controller.register);
router.post('/login', validate(loginSchema), controller.login);
router.post('/refresh', controller.refresh);

module.exports = router;
