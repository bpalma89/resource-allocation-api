const bcrypt = require('bcrypt');
const supertest = require('supertest');
const app = require('../app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
let token;
let testUserId;

async function createTestUserAndLogin() {
  const username = `testuser_${Date.now()}`;
  const passwordHash = await bcrypt.hash('password', 10);

  const user = await prisma.user.create({
    data: {
      username,
      name: 'Test User',
      email: `${username}@example.com`,
      passwordHash,
      role: 'admin'
    }
  });

  testUserId = user.id;

  const res = await supertest(app)
    .post('/login')
    .send({ username, password: 'password' });

  token = res.body.token;
}

function getAuthHeader() {
  return { Authorization: `Bearer ${token}` };
}

function getTestUserId() {
  return testUserId;
}

module.exports = {
  prisma,
  createTestUserAndLogin,
  getAuthHeader,
  getTestUserId
};
