const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

const { isValidRole } = require('../utils/validator');

exports.getAllUsers = () => {
  return prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      role: true,
    },
  });
};

exports.createUser = async ({ username, name, email, password, role }) => {
  if (!isValidRole(role)) {
    const error = new Error(`Invalid role. Allowed roles are: admin, editor, viewer.`);
    error.statusCode = 400;
    throw error;
  }

  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (existing) {
    const error = new Error(
      existing.username === username
        ? "Username already taken"
        : "Email already in use"
    );
    error.statusCode = 400;
    throw error;
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  return prisma.user.create({
    data: {
      username,
      name,
      email,
      passwordHash,
      role,
    },
  });
};

exports.authenticateUser = async (username, password) => {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return null;

  const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
  if (!passwordCorrect) return null;

  return user;
};
