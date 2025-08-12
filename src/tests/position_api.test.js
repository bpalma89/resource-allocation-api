const supertest = require('supertest');
const app = require('../app');
const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();
const api = supertest(app);

beforeAll(async () => {
  await prisma.allocation.deleteMany();
  await prisma.position.deleteMany();
  await prisma.project.deleteMany();

  await prisma.project.create({
    data: {
      id: 'proj-1',
      name: 'Test Project',
      description: 'Testing positions',
      start_date: new Date(),
      end_date: new Date(),
      status: 'Active',
      created_by: 'tester'
    }
  });
});

test('create position', async () => {
  const newPosition = {
    projectId: 'proj-1',
    title: 'Backend Developer',
    description: 'Build APIs',
    role: 'Developer',
    numberOfResources: 2,
    start_date: new Date(),
    end_date: new Date(),
    created_by: 'tester'
  };

  const res = await api
    .post('/positions')
    .send(newPosition)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  expect(res.body.title).toBe('Backend Developer');
});

test('get all positions', async () => {
  const res = await api
    .get('/positions')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(res.body).toHaveLength(1);
});

test('get position by id', async () => {
  const pos = await prisma.position.findFirst();
  const res = await api
    .get(`/positions/${pos.id}`)
    .expect(200);

  expect(res.body.id).toBe(pos.id);
});

test('update position', async () => {
  const pos = await prisma.position.findFirst();
  const res = await api
    .put(`/positions/${pos.id}`)
    .send({ title: 'Updated Title' })
    .expect(200);

  expect(res.body.title).toBe('Updated Title');
});

test('delete (soft) position', async () => {
  const pos = await prisma.position.findFirst();
  await api
    .delete(`/positions/${pos.id}`)
    .expect(204);

  const deleted = await prisma.position.findUnique({ where: { id: pos.id } });
  expect(deleted.is_deleted).toBe(true);
});

afterAll(async () => {
  await prisma.$disconnect();
});
