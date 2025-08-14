const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { excludeSoftDeleted } = require('../utils/softDeleteUtils');

exports.getAllAllocations = () => {
  return prisma.allocation.findMany({ where: excludeSoftDeleted() });
};

exports.getAllocation = (positionId, resourceId) => {
  return prisma.allocation.findUnique({
    where: { positionId_resourceId: { positionId, resourceId } }
  });
};

exports.createAllocation = (data) => {
  return prisma.allocation.create({ data });
};

exports.updateAllocation = (positionId, resourceId, data) => {
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