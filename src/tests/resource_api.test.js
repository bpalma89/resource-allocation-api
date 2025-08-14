const supertest = require('supertest');
const app = require('../app');
const { createTestUserAndLogin, getAuthHeader, prisma } = require('./testHelpers');

describe('Resources API', () => {
  let createdResource;

  beforeAll(async () => {
    await createTestUserAndLogin();
    await prisma.allocation.deleteMany();
    await prisma.resource.deleteMany();
  });

  test('Create resource', async () => {
    const res = await supertest(app)
      .post('/resources')
      .set(getAuthHeader())
      .send({
        first_name: 'Michael',
        last_name: 'Scott',
        birth_date: new Date('1990-05-15T00:00:00.000Z'),
        role: 'Developer',
        availability: 'available',
        cv_uri: 'https://example.com/cv/michael-scott.pdf',
        cv_modified_on: new Date(),
        created_on: new Date()
      })
      .expect(201);

    createdResource = res.body;
  });

  test('Get all resources', async () => {
    const res = await supertest(app)
      .get('/resources')
      .set(getAuthHeader())
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Get resource by ID', async () => {
    const res = await supertest(app)
      .get(`/resources/${createdResource.id}`)
      .set(getAuthHeader())
      .expect(200);

    expect(res.body.id).toBe(createdResource.id);
  });

  test('Update resource', async () => {
    const res = await supertest(app)
      .put(`/resources/${createdResource.id}`)
      .set(getAuthHeader())
      .send({ last_name: 'James' })
      .expect(200);

    expect(res.body.last_name).toBe('James');
  });

  test('Delete resource', async () => {
    await supertest(app)
      .delete(`/resources/${createdResource.id}`)
      .set(getAuthHeader())
      .expect(204);
  });
});
