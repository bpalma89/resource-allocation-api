const supertest = require('supertest');
const app = require('../app');
const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();
const api = supertest(app);

beforeAll(async () => {
  await prisma.allocation.deleteMany();
  await prisma.resource.deleteMany();
});

describe('Resources API', () => {
    test('resources can be created', async () => {
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
    
      await api
        .post('/resources')
        .send(newResource)
        .expect(201)
        .expect('Content-Type', /application\/json/);
    
      const resources = await prisma.resource.findMany();
      expect(resources).toHaveLength(1);
      expect(resources[0].first_name).toBe('Alice');
    });

    test('returns all resources', async () => {
        const res = await api.get('/resources').expect(200);
        expect(res.body).toHaveLength(1);
    });
});

afterAll(async () => {
  await prisma.$disconnect();
});
