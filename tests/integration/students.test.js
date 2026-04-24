import request from 'supertest';

import { prisma } from '../../src/config/prisma.js';
import { app } from '../../src/app.js';

const createdStudentEmails = new Set();

const createStudentPayload = () => {
  const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    fullName: `Aluno Teste ${uniqueSuffix}`,
    email: `aluno.${uniqueSuffix}@escola.com`,
    phone: '11999999999',
    currentLevel: 'BEGINNER',
    birthDate: '2005-05-10',
    notes: 'Aluno criado em teste de integracao',
    isActive: true,
    enrollmentDate: '2026-04-23'
  };
};

const createNonExistingStudentId = () => {
  const randomSuffix = Math.random().toString(36).slice(2, 26).padEnd(24, 'a');

  return `c${randomSuffix}`;
};

const loginAsAdmin = async () => {
  const response = await request(app).post('/api/auth/login').send({
    email: 'admin@escola.com',
    password: 'admin123'
  });

  expect(response.status).toBe(200);

  return response.body.token;
};

describe('Students integration tests', () => {
  afterEach(async () => {
    if (createdStudentEmails.size === 0) {
      return;
    }

    await prisma.student.deleteMany({
      where: {
        email: {
          in: Array.from(createdStudentEmails)
        }
      }
    });

    createdStudentEmails.clear();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a student with a valid token', async () => {
    const token = await loginAsAdmin();
    const payload = createStudentPayload();
    const response = await request(app)
      .post('/api/students')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    createdStudentEmails.add(payload.email);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      currentLevel: payload.currentLevel,
      notes: payload.notes,
      isActive: payload.isActive
    });
    expect(response.body).toHaveProperty('id');
  });

  it('should return 401 when creating a student without a token', async () => {
    const payload = createStudentPayload();

    const response = await request(app).post('/api/students').send(payload);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Authentication required',
      details: null
    });
  });

  it('should return 401 when creating a student with an invalid token', async () => {
    const payload = createStudentPayload();

    const response = await request(app)
      .post('/api/students')
      .set('Authorization', 'Bearer token-invalido')
      .send(payload);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Authentication required',
      details: null
    });
  });

  it('should return 400 when creating a student with invalid data', async () => {
    const token = await loginAsAdmin();
    const invalidPayload = {
      fullName: 'Al',
      email: 'email-invalido',
      currentLevel: 'INVALID_LEVEL'
    };

    const response = await request(app)
      .post('/api/students')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidPayload);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(response.body.details).toHaveProperty('fieldErrors');
    expect(response.body.details.fieldErrors).toHaveProperty('body');
  });

  it('should list students successfully', async () => {
    const response = await request(app).get('/api/students');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return 404 when finding a student by a non-existing id', async () => {
    const response = await request(app).get(`/api/students/${createNonExistingStudentId()}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Student not found',
      details: null
    });
  });

  it('should return 404 when updating a non-existing student', async () => {
    const token = await loginAsAdmin();

    const response = await request(app)
      .put(`/api/students/${createNonExistingStudentId()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        fullName: 'Aluno Inexistente Atualizado'
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Student not found',
      details: null
    });
  });

  it('should return 404 when deleting a non-existing student', async () => {
    const token = await loginAsAdmin();

    const response = await request(app)
      .delete(`/api/students/${createNonExistingStudentId()}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Student not found',
      details: null
    });
  });
});
