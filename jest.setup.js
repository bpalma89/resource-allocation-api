require('dotenv').config({ path: '.env.test' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  const tablenames = await prisma.$queryRaw`
    SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';
  `;
  for (const { name } of tablenames) {
    await prisma.$executeRawUnsafe(`DELETE FROM ${name}`);
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});
