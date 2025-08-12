const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { excludeSoftDeleted } = require('../utils/softDeleteUtils');

exports.getAllResources = async (req, res, next) => {
  try {
    const resources = await prisma.resource.findMany({ where: excludeSoftDeleted() });
    res.json(resources);
  } catch (err) {
    next(err);
  }
};

exports.getResourceById = async (req, res, next) => {
  try {
    const resource = await prisma.resource.findUnique({ where: { id: req.params.id } });
    if (!resource || resource.is_deleted) return res.status(404).json({ error: 'Not found' });
    res.json(resource);
  } catch (err) {
    next(err);
  }
};

exports.createResource = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      createdById: req.user.id,
      created_on: new Date(),
    };
    const resource = await prisma.resource.create({ data });
    res.status(201).json(resource);
  } catch (err) {
    next(err);
  }
};

exports.updateResource = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      modifiedById: req.user.id,
      modified_on: new Date(),
    };
    const resource = await prisma.resource.update({ where: { id: req.params.id }, data });
    res.json(resource);
  } catch (err) {
    next(err);
  }
};

exports.deleteResource = async (req, res, next) => {
  try {
    await prisma.resource.update({
      where: { id: req.params.id },
      data: { is_deleted: true, modifiedById: req.user.id, modified_on: new Date() },
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};