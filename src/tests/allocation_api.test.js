const supertest = require('supertest');
const app = require('../app');
const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();
const api = supertest(app);

beforeAll(async () => {
  await prisma.allocation.deleteMany();
  await prisma.position.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.project.deleteMany();

  const project = await prisma.project.create({
    data: {
      id: 'proj-1',
      name: 'Project with Allocations',
      start_date: new Date(),
      end_date: new Date(),
      status: 'Active',
      created_by: 'tester'
    }
  });

  const position = await prisma.position.create({
    data: {
      id: 'pos-1',
      projectId: project.id,
      title: 'Frontend Developer',
      role: 'Developer',
      numberOfResources: 1,
      start_date: new Date(),
      end_date: new Date(),
      created_by: 'tester'
    }
  });

  const resource = await prisma.resource.create({
    data: {
      id: 'res-1',
      first_name: 'Bob',
      last_name: 'Jones',
      birth_date: new Date('1985-09-15'),
      role: 'Developer',
      availability: 'Available',
      cv_uri: 'http://example.com/bobcv.pdf',
      cv_modified_on: new Date(),
      created_by: 'tester'
    }
  });

  global.testData = { positionId: position.id, resourceId: resource.id };
});

test('create allocation', async () => {
  const newAllocation = {
    positionId: global.testData.positionId,
    resourceId: global.testData.resourceId,
    status: 'Assigned',
    start_date: new Date(),
    end_date: new Date(),
    created_by: 'tester'
  };

  const res = await api
    .post('/allocations')
    .send(newAllocation)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  expect(res.body.status).toBe('Assigned');
});

test('get all allocations', async () => {
  const res = await api
    .get('/allocations')
    .expect(200);

  expect(res.body).toHaveLength(1);
});

test('get allocation by composite key', async () => {
  const { positionId, resourceId } = global.testData;
  const res = await api
    .get(`/allocations/${positionId}/${resourceId}`)
    .expect(200);

  expect(res.body.positionId).toBe(positionId);
  expect(res.body.resourceId).toBe(resourceId);
});

test('update allocation', async () => {
  const { positionId, resourceId } = global.testData;
  const res = await api
    .put(`/allocations/${positionId}/${resourceId}`)
    .send({ status: 'Completed' })
    .expect(200);

  expect(res.body.status).toBe('Completed');
});

test('delete (soft) allocation', async () => {
  const { positionId, resourceId } = global.testData;
  await api
    .delete(`/allocations/${positionId}/${resourceId}`)
    .expect(204);

  const deleted = await prisma.allocation.findUnique({
    where: {
      positionId_resourceId: {
        positionId,
        resourceId
      }
    }
  });
  expect(deleted.is_deleted).toBe(true);
});

afterAll(async () => {
  await prisma.$disconnect();
});
