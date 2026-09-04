const Joi = require('joi');

const registerSchema = Joi.object({
  fullName: Joi.string().min(2).max(150).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().max(20).optional(),
  password: Joi.string().min(8).max(72).required(),
  role: Joi.string().valid('JOB_SEEKER', 'EMPLOYER', 'FREELANCER', 'TRAINER', 'MANPOWER_VENDOR').required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema };
