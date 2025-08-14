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

async function validateAllocationUniqueness(positionId, resourceId) {
  const existing = await prisma.allocation.findUnique({
    where: {
      positionId_resourceId: {
        positionId,
        resourceId,
      },
    },
  });

  if (existing && !existing.is_deleted) {
    const error = new Error('An allocation with this position and resource already exists.');
    error.status = 400;
    throw error;
  }
}

module.exports = { 
  validateExists, 
  isValidRole,
  validateAllocationUniqueness
}