const prisma = require('../../config/database');

// Data-access layer for the "approvals" module.
// Keep raw Prisma/SQL calls here only — controllers and services never touch prisma directly.
// TODO: replace 'ENTITY' with the actual Prisma model name once prisma/schema.prisma is generated
// from database/schema.sql (see database/schema.sql for the source-of-truth table definitions).

async function findAll({ skip = 0, take = 20, where = {} } = {}) {
  // return prisma.ENTITY.findMany({ skip, take, where, orderBy: { id: 'desc' } });
  return [];
}

async function count(where = {}) {
  // return prisma.ENTITY.count({ where });
  return 0;
}

async function findById(id) {
  // return prisma.ENTITY.findUnique({ where: { id: Number(id) } });
  return null;
}

async function create(data) {
  // return prisma.ENTITY.create({ data });
  return { id: null, ...data };
}

async function update(id, data) {
  // return prisma.ENTITY.update({ where: { id: Number(id) }, data });
  return { id, ...data };
}

async function remove(id) {
  // return prisma.ENTITY.delete({ where: { id: Number(id) } });
  return true;
}

module.exports = { findAll, count, findById, create, update, remove };
