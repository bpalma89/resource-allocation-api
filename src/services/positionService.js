const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { excludeSoftDeleted } = require('../utils/softDeleteUtils');

exports.getAllPositions = () => {
  return prisma.position.findMany({ where: excludeSoftDeleted() });
};

exports.getPositionById = (id) => {
  return prisma.position.findUnique({ where: { id } });
};

exports.createPosition = async (data) => {
  const exists = await prisma.position.findFirst({
    where: {
      projectId: data.projectId,
      title: data.title,
      is_deleted: false
    }
  });

  if (exists) {
    const error = new Error("A position with this title already exists in the project");
    error.statusCode = 400;
    throw error;
  }

  return prisma.position.create({ data });
};

exports.updatePosition = async (id, data) => {
  const exists = await prisma.position.findFirst({
    where: {
      projectId: data.projectId,
      title: data.title,
      is_deleted: false,
      NOT: { id }
    }
  });

  if (exists) {
    const error = new Error("A position with this title already exists in the project");
    error.statusCode = 400;
    throw error;
  }

  return prisma.position.update({ where: { id }, data });
};

exports.deletePosition = (id, data) => {
  return prisma.position.update({ where: { id }, data });
};