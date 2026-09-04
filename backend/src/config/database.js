const { PrismaClient } = require('@prisma/client');

// Single shared Prisma client for the whole modular monolith.
// Every module's repository layer imports this instead of creating its own.
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

module.exports = prisma;
