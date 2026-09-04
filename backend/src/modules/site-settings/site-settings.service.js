const repository = require('./site-settings.repository');

// Fields exposed on the public endpoint. Everything on this table is
// site content anyway (nothing sensitive), but keeping an explicit allow-list
// means a future admin-only field can't leak onto the public site by accident.
const PUBLIC_FIELDS = [
  'heroHeading', 'heroSubtext', 'aboutCopy', 'supportEmail',
  'logoFileId', 'heroImageFileId', 'faviconFileId',
  'navLinks', 'footerTagline', 'footerLinks', 'socialLinks',
  'themeAccent', 'themeBase',
];

function toPublicShape(settings) {
  if (!settings) return null;
  const out = {};
  for (const key of PUBLIC_FIELDS) out[key] = settings[key];
  return out;
}

async function getPublicSettings() {
  const settings = await repository.getSingleton();
  return toPublicShape(settings);
}

async function getAdminSettings() {
  return repository.getSingleton();
}

async function updateSettings(payload, actorUserId) {
  const updated = await repository.upsertSingleton(payload);

  // Mirrors the "write audit log" step in the settings save flow — every
  // change is attributable to the admin who made it (see docs/api-structure.md).
  await repository.writeAuditLog({
    actorId: actorUserId,
    action: 'SITE_SETTINGS_UPDATED',
    entityType: 'SITE_SETTINGS',
    entityId: updated.id,
    metadata: payload,
  });

  return updated;
}

module.exports = { getPublicSettings, getAdminSettings, updateSettings };
