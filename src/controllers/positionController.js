const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const { excludeSoftDeleted } = require('../utils/softDeleteUtils');

exports.getAllPositions = async (req, res, next) => {
  try {
    const positions = await prisma.position.findMany({
      where: excludeSoftDeleted(),
    });
    res.json(positions);
  } catch (error) {
    next(error);
  }
};

exports.getPositionById = async (req, res, next) => {
  try {
    const position = await prisma.position.findUnique({
      where: { id: req.params.id },
    });
    if (!position || position.is_deleted) return res.status(404).json({ error: 'Not found' });
    res.json(position);
  } catch (error) {
    next(error);
  }
};

exports.createPosition = async (req, res, next) => {
  try {
    const position = await prisma.position.create({
      data: req.body,
    });
    res.status(201).json(position);
  } catch (error) {
    next(error);
  }
};

exports.updatePosition = async (req, res, next) => {
  try {
    const position = await prisma.position.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(position);
  } catch (error) {
    next(error);
  }
};

exports.deletePosition = async (req, res, next) => {
  try {
    await prisma.position.update({
      where: { id: req.params.id },
      data: { is_deleted: true },
    });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

exports.getPositionAllocations = async (req, res, next) => {
  try {
    const position = await prisma.position.findUnique({
      where: { id: req.params.id },
      include: {
        allocations: {
          where: excludeSoftDeleted(),
          include: {
            resource: true,
          },
        },
      },
    });

    if (!position || position.is_deleted) {
      return res.status(404).json({ error: 'Position not found' });
    }

    res.json(position.allocations);
  } catch (error) {
    next(error);
  }
};
