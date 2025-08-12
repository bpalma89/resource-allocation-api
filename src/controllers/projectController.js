const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { excludeSoftDeleted } = require('../utils/softDeleteUtils');

exports.getAllProjects = async (req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      where: excludeSoftDeleted(),
    });
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const project = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!project || project.is_deleted) return res.status(404).json({ error: 'Not found' });
    res.json(project);
  } catch (err) {
    next(err);
  }
};

exports.createProject = async (req, res, next) => {
  try {
    const project = await prisma.project.create({
      data: {
        ...req.body,
        createdById: req.user.id
      }
    });
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        ...req.body,
        modifiedById: req.user.id,
        modified_on: new Date()
      }
    });
    res.json(project);
  } catch (err) {
    next(err);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    await prisma.project.update({
      where: { id: req.params.id },
      data: {
        is_deleted: true,
        modifiedById: req.user.id,
        modified_on: new Date()
      }
    });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
