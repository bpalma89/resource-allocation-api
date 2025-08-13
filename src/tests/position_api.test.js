const supertest = require('supertest');
const app = require('../app');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const api = supertest(app);

let authToken;
let projectId;
let positionId;

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

  const projRes = await api
    .post('/projects')
    .set('Authorization', `Bearer ${authToken}`)
    .send({
      name: 'Project Beta',
      description: 'Test',
      start_date: new Date(),
      end_date: new Date(),
      status: 'Active'
    });
  projectId = projRes.body.id;
});

describe('Positions API', () => {
  test('create position', async () => {
    const res = await api
      .post('/positions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        projectId,
        title: 'Backend Dev',
        description: 'NodeJS developer',
        role: 'Developer',
        numberOfResources: 2,
        start_date: new Date(),
        end_date: new Date()
      })
      .expect(201);

    positionId = res.body.id;
    expect(res.body.projectId).toBe(projectId);
  });

  test('get all positions', async () => {
    const res = await api
      .get('/positions')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
