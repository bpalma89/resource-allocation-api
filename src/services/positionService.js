const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { excludeSoftDeleted } = require('../utils/softDeleteUtils');
const { validateExists, validateDateRange } = require('../utils/validationUtils');

exports.getAllPositions = () => {
  return prisma.position.findMany({ where: excludeSoftDeleted() });
};

exports.getPositionById = (id) => {
  return prisma.position.findUnique({ where: { id } });
};

exports.createPosition = async (data) => {

  await validateExists('project', data.projectId, 'Project');

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

  validateDateRange(data.start_date, data.end_date);

  return prisma.position.create({ data });
};

exports.updatePosition = async (id, data) => {

  if(data.projectId){
    await validateExists('project', data.projectId, 'Project');
  }

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

  if (data.start_date && data.end_date) {
    validateDateRange(data.start_date, data.end_date);
  }

  return prisma.position.update({ where: { id }, data });
};

exports.deletePosition = (id, data) => {
  return prisma.position.update({ where: { id }, data });
};

exports.getPositionAllocations = (id) => {
  return prisma.position.findUnique({
      where: { id },
      include: {
        allocations: {
          where: excludeSoftDeleted(),
          include: {
            resource: true,
          },
        },
      },
    });
};