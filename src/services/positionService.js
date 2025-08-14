const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { excludeSoftDeleted } = require('../utils/softDeleteUtils');

exports.getAllPositions = () => {
  return prisma.position.findMany({ where: excludeSoftDeleted() });
};

exports.getPositionById = (id) => {
  return prisma.position.findUnique({ where: { id } });
};

exports.createPosition = (data) => {
  return prisma.position.create({ data });
};

exports.updatePosition = (id, data) => {
  return prisma.position.update({ where: { id }, data });
};

exports.deletePosition = (id, data) => {
  return prisma.position.update({ where: { id }, data });
};