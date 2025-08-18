const supertest = require('supertest');
const app = require('../app');
const { createTestUserAndLogin, getAuthHeader, prisma } = require('./testHelpers');

describe('Projects API', () => {
  let createdProject;
  let testUser;

  beforeAll(async () => {
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
    await createTestUserAndLogin();

    testUser = await prisma.user.findFirst({
      where: { username: { startsWith: 'testuser_' } }
    });
  });

  test('Create project', async () => {
    const res = await supertest(app)
      .post('/projects')
      .set(getAuthHeader())
      .send({
        name: 'Project Alpha',
        description: 'Test project',
        start_date: "2025-09-01T00:00:00.000Z",
        end_date: "2025-12-31T00:00:00.000Z",
        status: 'active',
        createdById: testUser.id
      });

    console.log('Create project response:', res.status, res.body);

    expect(res.status).toBe(201);
    createdProject = res.body;
  });

  test('Get all projects', async () => {
    const res = await supertest(app)
      .get('/projects')
      .set(getAuthHeader())
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Get project by ID', async () => {
    const res = await supertest(app)
      .get(`/projects/${createdProject.id}`)
      .set(getAuthHeader())
      .expect(200);

    expect(res.body.id).toBe(createdProject.id);
  });

  test('Update project', async () => {
    const res = await supertest(app)
      .put(`/projects/${createdProject.id}`)
      .set(getAuthHeader())
      .send({ description: 'Updated project' })
      .expect(200);

    expect(res.body.description).toBe('Updated project');
  });

  test('Delete project', async () => {
    await supertest(app)
      .delete(`/projects/${createdProject.id}`)
      .set(getAuthHeader())
      .expect(204);
  });
});
