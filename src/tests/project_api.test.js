const supertest = require('supertest');
const app = require('../app');
const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();
const api = supertest(app);

beforeAll(async () => {
  await prisma.allocation.deleteMany();
  await prisma.position.deleteMany();
  await prisma.project.deleteMany();
});

test('create project', async () => {
  const newProject = {
    name: 'My Test Project',
    description: 'Test description',
    start_date: new Date(),
    end_date: new Date(),
    status: 'Active',
    created_by: 'tester'
  };

  const res = await api
    .post('/projects')
    .send(newProject)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  expect(res.body.name).toBe('My Test Project');
});

test('get all projects', async () => {
  const res = await api
    .get('/projects')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(res.body.length).toBeGreaterThan(0);
});

test('get project by id', async () => {
  const project = await prisma.project.findFirst();
  const res = await api
    .get(`/projects/${project.id}`)
    .expect(200);

  expect(res.body.id).toBe(project.id);
});

test('update project', async () => {
  const project = await prisma.project.findFirst();
  const res = await api
    .put(`/projects/${project.id}`)
    .send({ status: 'Completed' })
    .expect(200);

  expect(res.body.status).toBe('Completed');
});

test('delete (soft) project', async () => {
  const project = await prisma.project.findFirst();
  await api
    .delete(`/projects/${project.id}`)
    .expect(204);

  const deleted = await prisma.project.findUnique({ where: { id: project.id } });
  expect(deleted.is_deleted).toBe(true);
});

afterAll(async () => {
  await prisma.$disconnect();
});
