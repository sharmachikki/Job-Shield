const prisma = require('../../config/database');

// TODO: swap these for real prisma.user.* calls once prisma/schema.prisma
// is generated (npx prisma db pull) against database/schema.sql.

async function findByEmail(email) {
  // return prisma.user.findUnique({ where: { email } });
  return null;
}

async function createUser({ fullName, email, phone, passwordHash }) {
  // return prisma.user.create({ data: { fullName, email, phone, passwordHash, status: 'PENDING_VERIFICATION' } });
  return { id: 1, fullName, email, phone };
}

async function attachRole(userId, roleCode) {
  // const role = await prisma.role.findUnique({ where: { code: roleCode } });
  // return prisma.userRole.create({ data: { userId, roleId: role.id } });
  return true;
}

async function getRoles(userId) {
  // const rows = await prisma.userRole.findMany({ where: { userId, isActive: true }, include: { role: true } });
  // return rows.map(r => r.role.code);
  return ['JOB_SEEKER'];
}

async function saveRefreshToken(userId, token, expiresAt) {
  // return prisma.userSession.create({ data: { userId, refreshToken: token, expiresAt } });
  return true;
}

module.exports = { findByEmail, createUser, attachRole, getRoles, saveRefreshToken };
