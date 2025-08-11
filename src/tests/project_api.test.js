const supertest = require('supertest');
const app = require('../app');
const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();
const api = supertest(app);

beforeEach(async () => {
  await prisma.allocation.deleteMany();
  await prisma.position.deleteMany();
  await prisma.project.deleteMany();
});

describe('Projects API', () => {
  test('can create a new project', async () => {
    const newProject = {
      name: 'Test Project',
      description: 'Test description',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 86400000).toISOString(),
      status: 'active',
      created_by: 'test_user',
    };

    const res = await api
      .post('/projects')
      .send(newProject)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(res.body.name).toBe(newProject.name);

    const projectsInDb = await prisma.project.findMany();
    expect(projectsInDb).toHaveLength(1);
  });

  test('returns all projects', async () => {
    await prisma.project.create({
      data: {
        name: 'First Project',
        description: 'A project',
        start_date: new Date(),
        end_date: new Date(),
        status: 'active',
        created_by: 'test_user',
      },
    });

    const res = await api.get('/projects').expect(200);
    expect(res.body).toHaveLength(1);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
