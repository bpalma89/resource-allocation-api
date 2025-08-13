const supertest = require('supertest');
const app = require('../app');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const api = supertest(app);

let authToken;
let positionId;
let resourceId;

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
      name: 'Project Gamma',
      description: 'Test',
      start_date: new Date(),
      end_date: new Date(),
      status: 'Active'
    });
  const projectId = projRes.body.id;

  const posRes = await api
    .post('/positions')
    .set('Authorization', `Bearer ${authToken}`)
    .send({
      projectId,
      title: 'Frontend Dev',
      description: 'React developer',
      role: 'Developer',
      numberOfResources: 1,
      start_date: new Date(),
      end_date: new Date()
    });
  positionId = posRes.body.id;

  const resRes = await api
    .post('/resources')
    .set('Authorization', `Bearer ${authToken}`)
    .send({
      first_name: 'Bob',
      last_name: 'Smith',
      birth_date: new Date('1985-03-10'),
      role: 'Developer',
      availability: 'Available',
      cv_uri: 'http://example.com/cv/bob.pdf',
      cv_modified_on: new Date()
    });
  resourceId = resRes.body.id;
});

describe('Allocations API', () => {
  test('create allocation', async () => {
    const res = await api
      .post('/allocations')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        positionId,
        resourceId,
        status: 'Assigned',
        start_date: new Date(),
        end_date: new Date()
      })
      .expect(201);

    expect(res.body.positionId).toBe(positionId);
    expect(res.body.resourceId).toBe(resourceId);
  });

  test('get all allocations', async () => {
    const res = await api
      .get('/allocations')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
