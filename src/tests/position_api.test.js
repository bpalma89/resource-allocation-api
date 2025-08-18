const supertest = require('supertest');
const app = require('../app');
const { createTestUserAndLogin, getAuthHeader, getTestUserId, prisma } = require('./testHelpers');

describe('Positions API', () => {
  let createdPosition;
  let projectId;

  beforeAll(async () => {
    await createTestUserAndLogin();

    await prisma.allocation.deleteMany();
    await prisma.position.deleteMany();
    await prisma.project.deleteMany();

    const project = await prisma.project.create({
      data: {
        name: 'Test Project',
        description: 'Project for positions',
        created_on: new Date(),
        start_date: "2025-09-01T00:00:00.000Z",
        end_date: "2025-12-31T00:00:00.000Z",
        status: 'active',
        createdById: getTestUserId()
      }
    });
    projectId = project.id;
  });

  test('Create position', async () => {
    const res = await supertest(app)
      .post('/positions')
      .set(getAuthHeader())
      .send({
        title: 'Developer',
        role: 'Engineer',
        description: 'Backend developer',
        numberOfResources: 1,
        start_date: "2025-09-01T00:00:00.000Z",
        end_date: "2025-12-31T00:00:00.000Z",
        created_on: new Date(),
        projectId,
        createdById: getTestUserId()
      })
      .expect(201);

    createdPosition = res.body;
  });

  test('Get all positions', async () => {
    const res = await supertest(app)
      .get('/positions')
      .set(getAuthHeader())
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Get position by ID', async () => {
    const res = await supertest(app)
      .get(`/positions/${createdPosition.id}`)
      .set(getAuthHeader())
      .expect(200);

    expect(res.body.id).toBe(createdPosition.id);
  });

  test('Update position', async () => {
    const res = await supertest(app)
      .put(`/positions/${createdPosition.id}`)
      .set(getAuthHeader())
      .send({ title: 'Senior Developer' })
      .expect(200);

    expect(res.body.title).toBe('Senior Developer');
  });

  test('Delete position', async () => {
    await supertest(app)
      .delete(`/positions/${createdPosition.id}`)
      .set(getAuthHeader())
      .expect(204);
  });
});
