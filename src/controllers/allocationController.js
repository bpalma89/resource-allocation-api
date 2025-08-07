const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const { excludeSoftDeleted } = require('../utils/softDeleteUtils');

exports.createAllocation = async (req, res, next) => {
  try {
    const allocation = await prisma.allocation.create({
      data: req.body,
    });
    res.status(201).json(allocation);
  } catch (error) {
    next(error);
  }
};

exports.getAllAllocations = async (req, res, next) => {
  try {
    const allocations = await prisma.allocation.findMany({
      where: excludeSoftDeleted(),
    });
    res.json(allocations);
  } catch (error) {
    next(error);
  }
};

exports.getAllocation = async (req, res, next) => {
  try {
    const allocation = await prisma.allocation.findUnique({
      where: {
        positionId_resourceId: {
          positionId: req.params.positionId,
          resourceId: req.params.resourceId,
        },
      },
    });
    if (!allocation || allocation.is_deleted) return res.status(404).json({ error: 'Not found' });
    res.json(allocation);
  } catch (error) {
    next(error);
  }
};


exports.updateAllocation = async (req, res, next) => {
  try {
    const allocation = await prisma.allocation.update({
      where: {
        positionId_resourceId: {
          positionId: req.params.positionId,
          resourceId: req.params.resourceId,
        },
      },
      data: req.body,
    });
    res.json(allocation);
  } catch (error) {
    next(error);
  }
};

exports.deleteAllocation = async (req, res, next) => {
  try {
    await prisma.allocation.update({
      where: {
        positionId_resourceId: {
          positionId: req.params.positionId,
          resourceId: req.params.resourceId,
        },
      },
      data: { is_deleted: true },
    });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};