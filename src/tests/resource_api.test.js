const supertest = require('supertest');
const app = require('../app');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const api = supertest(app);

let authToken;
let resourceId;

beforeAll(async () => {
  await prisma.allocation.deleteMany();
  await prisma.position.deleteMany();
  await prisma.project.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.user.deleteMany();

  // Create user + login
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

describe('Resources API', () => {
  test('create resource', async () => {
    const res = await api
      .post('/resources')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        first_name: 'Alice',
        last_name: 'Johnson',
        birth_date: new Date('1990-05-15'),
        role: 'Developer',
        availability: 'Available',
        cv_uri: 'http://example.com/cv/alice.pdf',
        cv_modified_on: new Date()
      })
      .expect(201);

    resourceId = res.body.id;
    expect(res.body.first_name).toBe('Alice');
  });

  test('get all resources', async () => {
    const res = await api
      .get('/resources')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
