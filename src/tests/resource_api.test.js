const supertest = require('supertest');
const app = require('../app');
const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();
const api = supertest(app);

beforeAll(async () => {
  await prisma.allocation.deleteMany();
  await prisma.resource.deleteMany();
});

test('create resource', async () => {
  const newResource = {
    first_name: 'Alice',
    last_name: 'Smith',
    birth_date: new Date('1990-05-01'),
    role: 'Developer',
    availability: 'Available',
    cv_uri: 'http://example.com/cv.pdf',
    cv_modified_on: new Date(),
    created_by: 'tester'
  };

  const res = await api
    .post('/resources')
    .send(newResource)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  expect(res.body.first_name).toBe('Alice');
});

test('get all resources', async () => {
  const res = await api
    .get('/resources')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(res.body).toHaveLength(1);
});

test('get resource by id', async () => {
  const resEntity = await prisma.resource.findFirst();
  const res = await api
    .get(`/resources/${resEntity.id}`)
    .expect(200);

  expect(res.body.id).toBe(resEntity.id);
});

test('update resource', async () => {
  const resEntity = await prisma.resource.findFirst();
  const res = await api
    .put(`/resources/${resEntity.id}`)
    .send({ role: 'Lead Developer' })
    .expect(200);

  expect(res.body.role).toBe('Lead Developer');
});

test('delete (soft) resource', async () => {
  const resEntity = await prisma.resource.findFirst();
  await api
    .delete(`/resources/${resEntity.id}`)
    .expect(204);

  const deleted = await prisma.resource.findUnique({ where: { id: resEntity.id } });
  expect(deleted.is_deleted).toBe(true);
});

afterAll(async () => {
  await prisma.$disconnect();
});
