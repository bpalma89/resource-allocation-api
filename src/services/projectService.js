const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { excludeSoftDeleted } = require('../utils/softDeleteUtils');

exports.getAllProjects = () => {
  return prisma.project.findMany({ where: excludeSoftDeleted() });
};

exports.getProjectById = (id) => {
  return prisma.project.findUnique({ where: { id } });
};

exports.createProject = (data) => {
  return prisma.project.create({ data });
};

exports.updateProject = (id, data) => {
  return prisma.project.update({ where: { id }, data });
};

exports.deleteProject = (id, data) => {
  return prisma.project.update({ where: { id }, data });
};
