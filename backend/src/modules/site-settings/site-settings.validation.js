const Joi = require('joi');

const hexColor = Joi.string().pattern(/^#([0-9A-Fa-f]{6})$/);

const navLinkSchema = Joi.object({
  label: Joi.string().max(50).required(),
  url: Joi.string().max(255).required(),
  visible: Joi.boolean().default(true),
});

// PUT /settings/admin accepts any subset of fields — each tab saves
// independently, so nothing here is required.
const updateSchema = Joi.object({
  heroHeading: Joi.string().max(255).allow(''),
  heroSubtext: Joi.string().max(1000).allow(''),
  aboutCopy: Joi.string().max(2000).allow(''),
  supportEmail: Joi.string().email().allow(''),

  logoFileId: Joi.number().integer().allow(null),
  heroImageFileId: Joi.number().integer().allow(null),
  faviconFileId: Joi.number().integer().allow(null),

  navLinks: Joi.array().items(navLinkSchema),
  footerTagline: Joi.string().max(255).allow(''),
  footerLinks: Joi.array().items(Joi.string().max(50)),
  socialLinks: Joi.array().items(Joi.string().uri({ allowRelative: true })),

  themeAccent: hexColor,
  themeBase: hexColor,
}).min(1);

module.exports = { updateSchema };
