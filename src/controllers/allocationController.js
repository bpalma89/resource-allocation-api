const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { excludeSoftDeleted } = require('../utils/softDeleteUtils');
const { validateExists } = require('../utils/validator');

exports.getAllAllocations = async (req, res, next) => {
  try {
    const allocations = await prisma.allocation.findMany({ where: excludeSoftDeleted() });
    res.json(allocations);
  } catch (err) {
    next(err);
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
  } catch (err) {
    next(err);
  }
};

exports.createAllocation = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      createdById: req.user.id,
      created_on: new Date(),
    };

    await validateExists('position', req.body.positionId, 'Position');
    await validateExists('resource', req.body.resourceId, 'Resource');

    const allocation = await prisma.allocation.create({ data });
    res.status(201).json(allocation);
  } catch (err) {
    next(err);
  }
};

exports.updateAllocation = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      modifiedById: req.user.id,
      modified_on: new Date(),
    };
    const allocation = await prisma.allocation.update({
      where: {
        positionId_resourceId: {
          positionId: req.params.positionId,
          resourceId: req.params.resourceId,
        },
      },
      data,
    });
    res.json(allocation);
  } catch (err) {
    next(err);
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
      data: { is_deleted: true, modifiedById: req.user.id, modified_on: new Date() },
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};