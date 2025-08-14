const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function validateExists(model, id, modelName) {
  const exists = await prisma[model].findUnique({ where: { id } });
  if (!exists) throw new Error(`${modelName} with ID ${id} does not exist.`);
}

module.exports = { validateExists }