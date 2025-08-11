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

    test('can get a position by ID', async () => {
        const position = await prisma.position.create({
            data: {
            projectId: 'proj-1',
            title: 'Frontend Developer',
            description: 'Build UI',
            role: 'Developer',
            numberOfResources: 1,
            start_date: new Date(),
            end_date: new Date(),
            created_by: 'tester'
            }
        });

        const res = await api.get(`/positions/${position.id}`).expect(200);
        expect(res.body.title).toBe('Frontend Developer');
    });

    test('can update a position', async () => {
        const position = await prisma.position.create({
            data: {
            projectId: 'proj-1',
            title: 'QA Engineer',
            description: 'Test software',
            role: 'QA',
            numberOfResources: 1,
            start_date: new Date(),
            end_date: new Date(),
            created_by: 'tester'
            }
        });

        const updatedData = {
            title: 'Senior QA Engineer',
            description: 'Test and automate',
        };

        const res = await api
            .put(`/positions/${position.id}`)
            .send(updatedData)
            .expect(200);

        expect(res.body.title).toBe('Senior QA Engineer');
        expect(res.body.description).toBe('Test and automate');
    });

    test('can soft delete a position', async () => {
        const position = await prisma.position.create({
            data: {
            projectId: 'proj-1',
            title: 'DevOps Engineer',
            description: 'Manage infrastructure',
            role: 'DevOps',
            numberOfResources: 1,
            start_date: new Date(),
            end_date: new Date(),
            created_by: 'tester'
            }
        });

        await api.delete(`/positions/${position.id}`).expect(204);

        const deleted = await prisma.position.findUnique({
            where: { id: position.id },
        });

        expect(deleted.is_deleted).toBe(true);
    });
});

afterAll(async () => {
  await prisma.$disconnect();
});
