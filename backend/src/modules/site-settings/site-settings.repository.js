const prisma = require('../../config/database');

// site_settings is a singleton config table (id = 1) — see database/schema.sql
// section 10. Swap these for real prisma.siteSetting.* calls once
// `npx prisma db pull` has introspected it into prisma/schema.prisma.

async function getSingleton() {
  // return prisma.siteSetting.findUnique({ where: { id: 1 } });
  return null;
}

async function upsertSingleton(data) {
  // return prisma.siteSetting.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } });
  return { id: 1, ...data };
}

async function writeAuditLog({ actorId, action, entityType, entityId, metadata }) {
  // return prisma.auditLog.create({ data: { actorId, action, entityType, entityId, metadata } });
  return true;
}

module.exports = { getSingleton, upsertSingleton, writeAuditLog };
