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

    test('can get a resource by ID', async () => {
        const resource = await prisma.resource.create({
            data: {
            first_name: 'Bob',
            last_name: 'Brown',
            birth_date: new Date('1985-03-15'),
            role: 'Tester',
            availability: 'Available',
            cv_uri: 'http://example.com/cv-bob.pdf',
            cv_modified_on: new Date(),
            created_by: 'tester'
            },
        });

        const res = await api.get(`/resources/${resource.id}`).expect(200);
        expect(res.body.first_name).toBe('Bob');
    });

    test('can update a resource', async () => {
        const resource = await prisma.resource.create({
            data: {
            first_name: 'Charlie',
            last_name: 'Green',
            birth_date: new Date('1992-07-20'),
            role: 'Analyst',
            availability: 'Available',
            cv_uri: 'http://example.com/cv-charlie.pdf',
            cv_modified_on: new Date(),
            created_by: 'tester'
            },
        });

        const updatedData = {
            role: 'Senior Analyst',
            availability: 'Unavailable',
        };

        const res = await api
            .put(`/resources/${resource.id}`)
            .send(updatedData)
            .expect(200);

        expect(res.body.role).toBe('Senior Analyst');
        expect(res.body.availability).toBe('Unavailable');
    });

    test('can soft delete a resource', async () => {
        const resource = await prisma.resource.create({
            data: {
            first_name: 'Diana',
            last_name: 'White',
            birth_date: new Date('1988-11-11'),
            role: 'Manager',
            availability: 'Available',
            cv_uri: 'http://example.com/cv-diana.pdf',
            cv_modified_on: new Date(),
            created_by: 'tester'
            },
        });

        await api.delete(`/resources/${resource.id}`).expect(204);

        const deletedResource = await prisma.resource.findUnique({
            where: { id: resource.id },
        });

        expect(deletedResource.is_deleted).toBe(true);
    });
});

afterAll(async () => {
  await prisma.$disconnect();
});
