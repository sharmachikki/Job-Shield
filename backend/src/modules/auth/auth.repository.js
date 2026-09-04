const prisma = require('../../config/database');
const { v4: uuidv4 } = require('uuid');

/**
 * Repository implementation using raw SQL via Prisma client so it works
 * against the provided database/schema.sql layout without requiring
 * an exact Prisma schema mapping.
 */

async function findByEmail(email) {
  const rows = await prisma.$queryRaw`
    SELECT id, uuid, full_name AS fullName, email, phone, password_hash AS passwordHash, status
    FROM users
    WHERE email = ${email}
    LIMIT 1
  `;
  return rows[0] || null;
}

async function createUser({ fullName, email, phone, passwordHash }) {
  const uuid = uuidv4();
  await prisma.$executeRaw`
    INSERT INTO users (uuid, full_name, email, phone, password_hash, status, created_at, updated_at)
    VALUES (${uuid}, ${fullName}, ${email}, ${phone}, ${passwordHash}, 'ACTIVE', NOW(), NOW())
  `;
  const rows = await prisma.$queryRaw`
    SELECT id, uuid, full_name AS fullName, email, phone, created_at AS createdAt
    FROM users
    WHERE id = LAST_INSERT_ID()
    LIMIT 1
  `;
  return rows[0];
}

async function attachRole(userId, roleCode) {
  // ensure role exists
  let rows = await prisma.$queryRaw`
    SELECT id FROM roles WHERE code = ${roleCode} LIMIT 1
  `;
  let roleId;
  if (rows && rows.length > 0) {
    roleId = rows[0].id;
  } else {
    const insert = await prisma.$executeRaw`
      INSERT INTO roles (code, name, is_admin_role, created_at)
      VALUES (${roleCode}, ${roleCode}, 0, NOW())
    `;
    const r = await prisma.$queryRaw`
      SELECT id FROM roles WHERE code = ${roleCode} LIMIT 1
    `;
    roleId = r[0].id;
  }

  // attach role to user if not already attached
  await prisma.$executeRaw`
    INSERT IGNORE INTO user_roles (user_id, role_id, is_active, assigned_at)
    VALUES (${userId}, ${roleId}, 1, NOW())
  `;
  return true;
}

async function getRoles(userId) {
  const rows = await prisma.$queryRaw`
    SELECT r.code FROM roles r
    JOIN user_roles ur ON ur.role_id = r.id
    WHERE ur.user_id = ${userId} AND ur.is_active = 1
  `;
  return rows.map(r => r.code);
}

async function saveRefreshToken(userId, token, expiresAt) {
  await prisma.$executeRaw`
    INSERT INTO user_sessions (user_id, refresh_token, expires_at, created_at)
    VALUES (${userId}, ${token}, ${expiresAt}, NOW())
  `;
  return true;
}

module.exports = { findByEmail, createUser, attachRole, getRoles, saveRefreshToken };
