const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { excludeSoftDeleted } = require('../utils/softDeleteUtils');

exports.getAllResources = () => {
  return prisma.resource.findMany({ where: excludeSoftDeleted() });
};

exports.getResourceById = (id) => {
  return prisma.resource.findUnique({ where: { id } });
};

exports.createResource = (data) => {
  return prisma.resource.create({ data });
};

exports.updateResource = (id, data) => {
  return prisma.resource.update({ where: { id }, data });
};

exports.deleteResource = (id, data) => {
  return prisma.resource.update({ where: { id }, data });
};