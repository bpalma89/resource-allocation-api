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
  
  test('can get a project by ID', async () => {
    const createdProject = await prisma.project.create({
        data: {
        name: 'Project by ID',
        description: 'Description',
        start_date: new Date(),
        end_date: new Date(),
        status: 'active',
        created_by: 'test_user',
        },
    });

    const res = await api.get(`/projects/${createdProject.id}`).expect(200);
    expect(res.body.name).toBe('Project by ID');
  });

  test('can update a project', async () => {
    const createdProject = await prisma.project.create({
        data: {
        name: 'Old Name',
        description: 'Old description',
        start_date: new Date(),
        end_date: new Date(),
        status: 'active',
        created_by: 'test_user',
        },
    });

    const updatedData = {
        name: 'Updated Name',
        description: 'Updated description',
    };

    const res = await api
        .put(`/projects/${createdProject.id}`)
        .send(updatedData)
        .expect(200);

    expect(res.body.name).toBe(updatedData.name);
    expect(res.body.description).toBe(updatedData.description);
  });

  test('can soft delete a project', async () => {
    const createdProject = await prisma.project.create({
        data: {
        name: 'Project to Delete',
        description: 'To be deleted',
        start_date: new Date(),
        end_date: new Date(),
        status: 'active',
        created_by: 'test_user',
        },
    });

    const res = await api
        .delete(`/projects/${createdProject.id}`)
        .expect(200);

    expect(res.body.message).toBe('Project deleted (soft)');

    const deletedProject = await prisma.project.findUnique({
        where: { id: createdProject.id },
    });

    expect(deletedProject.is_deleted).toBe(true);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
