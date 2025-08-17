const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { excludeSoftDeleted } = require('../utils/softDeleteUtils');
const { validateExists, validateDateRange } = require('../utils/validationUtils');

exports.getAllAllocations = () => {
  return prisma.allocation.findMany({ where: excludeSoftDeleted() });
};

exports.getAllocation = (positionId, resourceId) => {
  return prisma.allocation.findUnique({
    where: { positionId_resourceId: { positionId, resourceId } }
  });
};

exports.createAllocation = async (data) => {
  await validateExists('position', data.positionId, 'Position');
  await validateExists('resource', data.resourceId, 'Resource');

  const exists = await prisma.allocation.findFirst({
    where: {
      positionId: data.positionId,
      resourceId: data.resourceId,
      is_deleted: false
    }
  });

  if (exists) {
    const error = new Error("This resource is already allocated to the position");
    error.statusCode = 400;
    throw error;
  }

  validateDateRange(data.start_date, data.end_date);

  return prisma.allocation.create({ data });
};

exports.updateAllocation = async (positionId, resourceId, data) => {
  if (data.positionId) {
    await validateExists('position', data.positionId, 'Position');
  }
  if (data.resourceId) {
    await validateExists('resource', data.resourceId, 'Resource');
  }

  if (data.positionId || data.resourceId) {
    const newPositionId = data.positionId ?? positionId;
    const newResourceId = data.resourceId ?? resourceId;

    const exists = await prisma.allocation.findFirst({
      where: {
        positionId: newPositionId,
        resourceId: newResourceId,
        is_deleted: false,
        NOT: { positionId_resourceId: { positionId, resourceId } }
      }
    });

    if (exists) {
      const error = new Error("Another allocation with the same position and resource exists");
      error.statusCode = 400;
      throw error;
    }
  }

  if (data.start_date && data.end_date) {
    validateDateRange(data.start_date, data.end_date);
  }

  return prisma.allocation.update({
    where: { positionId_resourceId: { positionId, resourceId } },
    data
  });
};

exports.deleteAllocation = (positionId, resourceId, data) => {
  return prisma.allocation.update({
    where: { positionId_resourceId: { positionId, resourceId } },
    data
  });
};