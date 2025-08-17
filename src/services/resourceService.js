const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { excludeSoftDeleted } = require('../utils/softDeleteUtils');
const { validateBirthday } = require('../utils/validationUtils');

exports.getAllResources = () => {
  return prisma.resource.findMany({ where: excludeSoftDeleted() });
};

exports.getResourceById = (id) => {
  return prisma.resource.findUnique({ where: { id } });
};

exports.createResource = async (data) => {
  const exists = await prisma.resource.findFirst({
    where: {
      OR: [
        { cv_uri: data.cv_uri, is_deleted: false },
        { 
          first_name: data.first_name, 
          last_name: data.last_name, 
          birth_date: data.birth_date, 
          is_deleted: false 
        }
      ]
    }
  });

  if (exists) {
    const error = new Error("A resource with the same CV or identity already exists");
    error.statusCode = 400;
    throw error;
  }

  validateBirthday(data.birth_date);

  return prisma.resource.create({ data });
};

exports.updateResource = async (id, data) => {
  const exists = await prisma.resource.findFirst({
    where: {
      OR: [
        { cv_uri: data.cv_uri, is_deleted: false },
        { 
          first_name: data.first_name, 
          last_name: data.last_name, 
          birth_date: data.birth_date, 
          is_deleted: false 
        }
      ],
      NOT: { id }
    }
  });

  if (exists) {
    const error = new Error("A resource with the same CV or identity already exists");
    error.statusCode = 400;
    throw error;
  }

  if(data.birth_date){
    validateBirthday(data.birth_date);
  }

  return prisma.resource.update({ where: { id }, data });
};

exports.deleteResource = (id, data) => {
  return prisma.resource.update({ where: { id }, data });
};