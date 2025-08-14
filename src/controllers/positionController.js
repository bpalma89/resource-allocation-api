const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { excludeSoftDeleted } = require('../utils/softDeleteUtils');
const { validateExists } = require('../utils/validator');

exports.getAllPositions = async (req, res, next) => {
  try {
    const positions = await prisma.position.findMany({ where: excludeSoftDeleted() });
    res.json(positions);
  } catch (err) {
    next(err);
  }
};

exports.getPositionById = async (req, res, next) => {
  try {
    const position = await prisma.position.findUnique({ where: { id: req.params.id } });
    if (!position || position.is_deleted) return res.status(404).json({ error: 'Not found' });
    res.json(position);
  } catch (err) {
    next(err);
  }
};

exports.createPosition = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      createdById: req.user.id,
      created_on: new Date(),
    };

    await validateExists('project', req.body.projectId, 'Project');

    const position = await prisma.position.create({ data });
    res.status(201).json(position);
  } catch (err) {
    next(err);
  }
};

exports.updatePosition = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      modifiedById: req.user.id,
      modified_on: new Date(),
    };
    const position = await prisma.position.update({ where: { id: req.params.id }, data });
    res.json(position);
  } catch (err) {
    next(err);
  }
};

exports.deletePosition = async (req, res, next) => {
  try {
    await prisma.position.update({
      where: { id: req.params.id },
      data: { is_deleted: true, modifiedById: req.user.id, modified_on: new Date() },
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};