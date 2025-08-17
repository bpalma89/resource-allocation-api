const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const ROLES = require('./roles');

async function validateExists(model, id, modelName) {
  const exists = await prisma[model].findUnique({ where: { id } });
  if (!exists) throw new Error(`${modelName} with ID ${id} does not exist.`);
}

function isValidRole(role) {
  return Object.values(ROLES).includes(role);
}

module.exports = { 
  validateExists, 
  isValidRole
}