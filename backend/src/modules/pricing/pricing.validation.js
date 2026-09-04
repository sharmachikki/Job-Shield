const Joi = require('joi');

// TODO: replace with the real field list for "pricing" once the frontend
// forms/DB columns are finalized (see database/schema.sql).
const createSchema = Joi.object({
  name: Joi.string().max(255).optional(),
}).unknown(true);

const updateSchema = createSchema;

module.exports = { createSchema, updateSchema };
