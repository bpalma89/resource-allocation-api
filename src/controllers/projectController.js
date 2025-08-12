const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const { excludeSoftDeleted } = require('../utils/softDeleteUtils');

exports.createProject = async (req, res, next) => {
  try {
    const project = await prisma.project.create({
      data: req.body,
    });
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

exports.getAllProjects = async (req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      where: excludeSoftDeleted(),
    });
    res.json(projects);
  } catch (error) {
    next(error); 
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
    });
    if (!project || project.is_deleted) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    next(error);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(project);
  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: { is_deleted: true },
    });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

exports.getProjectPositions = async (req, res, next) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        positions: {
          where: excludeSoftDeleted(),
        },
      },
    });

    if (!project || project.is_deleted) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project.positions);
  } catch (error) {
    next(error);
  }
};