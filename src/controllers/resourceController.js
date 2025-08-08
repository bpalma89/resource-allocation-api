const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const { excludeSoftDeleted } = require('../utils/softDeleteUtils');

exports.createResource = async (req, res, next) => {
  try {
    const resource = await prisma.resource.create({
      data: req.body,
    });
    res.status(201).json(resource);
  } catch (error) {
    next(error);
  }
};

exports.getAllResources = async (req, res, next) => {
  try {
    const resources = await prisma.resource.findMany({
          where: excludeSoftDeleted(),
        });
    res.json(resources);
  } catch (error) {
    next(error);
  }
};

exports.getResourceById = async (req, res, next) => {
  try {
    const resource = await prisma.resource.findUnique({
      where: { id: req.params.id },
    });
    if (!resource || resource.is_deleted) return res.status(404).json({ error: 'Not found' });
    res.json(resource);
  } catch (error) {
    next(error);
  }
};


exports.updateResource = async (req, res, next) => {
  try {
    const resource = await prisma.resource.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(resource);
  } catch (error) {
    next(error);
  }
};

exports.deleteResource = async (req, res, next) => {
  try {
    await prisma.resource.update({
      where: { id: req.params.id },
      data: { is_deleted: true },
    });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

exports.getResourceAllocations = async (req, res, next) => {
  try {
    const resource = await prisma.resource.findUnique({
      where: { id: req.params.id },
      include: {
        allocations: {
          where: excludeSoftDeleted(),
          include: {
            position: true,
          },
        },
      },
    });

    if (!resource || resource.is_deleted) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json(resource.allocations);
  } catch (error) {
    next(error);
  }
};
