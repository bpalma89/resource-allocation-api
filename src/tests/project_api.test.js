const supertest = require('supertest');
const app = require('../app');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const api = supertest(app);

let authToken;
let projectId;

beforeAll(async () => {
  await prisma.allocation.deleteMany();
  await prisma.position.deleteMany();
  await prisma.project.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.user.deleteMany();

  await api.post('/users').send({
    username: 'testuser',
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'ADMIN'
  });

  const loginRes = await api.post('/login').send({
    username: 'testuser',
    password: 'password123'
  });
  authToken = loginRes.body.token;
});

describe('Projects API', () => {
  test('create project', async () => {
    const res = await api
      .post('/projects')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Project Alpha',
        description: 'Test project',
        start_date: new Date(),
        end_date: new Date(),
        status: 'Active'
      })
      .expect(201);

    projectId = res.body.id;
    expect(res.body.createdById).toBeDefined();
  });

  test('get all projects', async () => {
    const res = await api
      .get('/projects')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
