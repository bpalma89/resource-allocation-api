const supertest = require('supertest');
const app = require('../app');
const { createTestUserAndLogin, getAuthHeader, getTestUserId, prisma } = require('./testHelpers');

describe('Allocations API', () => {
  let allocationKeys;
  let positionId;
  let resourceId;

  beforeAll(async () => {
    await createTestUserAndLogin();

    await prisma.allocation.deleteMany();
    await prisma.position.deleteMany();
    await prisma.resource.deleteMany();
    await prisma.project.deleteMany();

    const userId = getTestUserId();

    const project = await prisma.project.create({
      data: {
        name: 'Alloc Project',
        description: 'For allocation tests',
        created_on: new Date(),
        start_date: "2025-09-01T00:00:00.000Z",
        end_date: "2025-12-31T00:00:00.000Z",
        status: 'active',
        createdById: userId
      }
    });

    const position = await prisma.position.create({
      data: {
        title: 'Tester',
        role: 'QA',
        description: 'Testing role',
        numberOfResources: 1,
        start_date: "2025-09-01T00:00:00.000Z",
        end_date: "2025-12-31T00:00:00.000Z",
        created_on: new Date(),
        projectId: project.id,
        createdById: userId
      }
    });

    const resource = await prisma.resource.create({
      data: {
        first_name: 'Jane',
        last_name: 'Smith',
        birth_date: new Date('1990-05-15T00:00:00.000Z'),
        role: 'Developer',
        availability: 'available',
        cv_uri: 'https://example.com/cv/jane-smith.pdf',
        cv_modified_on: new Date(),
        created_on: new Date(),
        createdById: userId
      }
    });

    positionId = position.id;
    resourceId = resource.id;
  });

  test('Create allocation', async () => {
    const res = await supertest(app)
      .post('/allocations')
      .set(getAuthHeader())
      .send({
        positionId,
        resourceId,
        status: 'active',
        start_date: "2025-09-01T00:00:00.000Z",
        end_date: "2025-12-31T00:00:00.000Z",
        createdById: getTestUserId()
      })
      .expect(201);

    allocationKeys = {
      positionId: res.body.positionId,
      resourceId: res.body.resourceId
    };
  });

  test('Get all allocations', async () => {
    const res = await supertest(app)
      .get('/allocations')
      .set(getAuthHeader())
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Get allocation by composite ID', async () => {
    const res = await supertest(app)
      .get(`/allocations/${allocationKeys.positionId}/${allocationKeys.resourceId}`)
      .set(getAuthHeader())
      .expect(200);

    expect(res.body.positionId).toBe(allocationKeys.positionId);
  });

  test('Update allocation', async () => {
    const res = await supertest(app)
      .put(`/allocations/${allocationKeys.positionId}/${allocationKeys.resourceId}`)
      .set(getAuthHeader())
      .send({ end_date: new Date() })
      .expect(200);

    expect(res.body.end_date).toBeDefined();
  });

  test('Delete allocation', async () => {
    await supertest(app)
      .delete(`/allocations/${allocationKeys.positionId}/${allocationKeys.resourceId}`)
      .set(getAuthHeader())
      .expect(204);
  });
});
