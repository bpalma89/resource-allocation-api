const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const ROLES = require('./roles');

async function validateExists(model, id, modelName) {
  const exists = await prisma[model].findUnique({ where: { id } });
  if (!exists) throw new Error(`${modelName} with ID ${id} does not exist.`);
}

function isValidRole(role) {
  return Object.values(ROLES).includes(role);
}

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    throw new Error('Invalid email format');
  }
}

function validateDateRange(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const now = new Date();

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error('One or both dates are invalid.');
  }

  if (endDate.getTime() < startDate.getTime()) {
    throw new Error('End date cannot be earlier than start date.');
  }

  
  if (startDate.getTime() < now.getTime() || endDate.getTime() < now.getTime()) {
    throw new Error('Start date and end date cannot be in the past.');
  }

  const sameDay =
    startDate.getUTCFullYear() === endDate.getUTCFullYear() &&
    startDate.getUTCMonth() === endDate.getUTCMonth() &&
    startDate.getUTCDate() === endDate.getUTCDate();

  if (sameDay) {
    throw new Error('Start date and end date cannot be on the same day.');
  }
}

function validateNotEmpty(fieldName, value) {
  if (!value || value.toString().trim() === '') {
    throw new Error(`${fieldName} cannot be empty`);
  }
}

function validateBirthday(birthday) {
  if (!birthday) return;
  const today = new Date();

  const birthDate = new Date(birthday);
  if (birthDate > today) {
    throw new Error(`Birthday cannot be in the future.`);
  }
}

module.exports = {
  validateEmail,
  validateNotEmpty, 
  validateExists, 
  isValidRole,
  validateDateRange,
  validateBirthday
}