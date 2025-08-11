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

describe('Positions API', () => {
    test('positions can be created', async () => {
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
    
      await api
        .post('/positions')
        .send(newPosition)
        .expect(201)
        .expect('Content-Type', /application\/json/);
    
      const positions = await prisma.position.findMany();
      expect(positions).toHaveLength(1);
      expect(positions[0].title).toBe('Backend Developer');
    });

    test('returns all positions', async () => {
        const res = await api.get('/positions').expect(200);
        expect(res.body).toHaveLength(1);
    });
});

afterAll(async () => {
  await prisma.$disconnect();
});
