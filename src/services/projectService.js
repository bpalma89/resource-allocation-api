const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { excludeSoftDeleted } = require('../utils/softDeleteUtils');
const { validateDateRange } = require('../utils/validationUtils');

exports.getAllProjects = () => {
  return prisma.project.findMany({ where: excludeSoftDeleted() });
};

exports.getProjectById = (id) => {
  return prisma.project.findUnique({ where: { id } });
};

exports.createProject = async (data) => {
  const exists = await prisma.project.findFirst({
    where: {
      name: data.name,
      is_deleted: false
    }
  });

  if (exists) {
    const error = new Error("Project name already exists");
    error.statusCode = 400;
    throw error;
  }

  validateDateRange(data.start_date, data.end_date);

  return prisma.project.create({ data });
};

exports.updateProject = async (id, data) => {
  if (data.name) {
    const existing = await prisma.project.findFirst({
      where: {
        name: data.name,
        id: { not: id },
        is_deleted: false,
      },
    });

    if (existing) {
      throw new Error('Another project with this name already exists');
    }
  }

  if (data.start_date && data.end_date) {
    validateDateRange(data.start_date, data.end_date);
  }

  return prisma.project.update({ where: { id }, data });
};

exports.deleteProject = (id, data) => {
  return prisma.project.update({ where: { id }, data });
};
