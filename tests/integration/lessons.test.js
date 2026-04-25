import request from 'supertest';

import { prisma } from '../../src/config/prisma.js';
import { app } from '../../src/app.js';

const createdLessonIds = new Set();

const createLessonPayload = () => ({
  date: new Date().toISOString(),
  content: `Lesson content ${Date.now()} ${Math.random().toString(36).slice(2, 8)}`,
  notes: 'Lesson notes for integration test'
});

const createNonExistingLessonId = () => {
  const randomSuffix = Math.random().toString(36).slice(2, 26).padEnd(24, 'b');

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

describe('Lessons integration tests', () => {
  afterEach(async () => {
    if (createdLessonIds.size === 0) {
      return;
    }

    await prisma.progress.deleteMany({
      where: {
        lessonId: {
          in: Array.from(createdLessonIds)
        }
      }
    });

    await prisma.lesson.deleteMany({
      where: {
        id: {
          in: Array.from(createdLessonIds)
        }
      }
    });

    createdLessonIds.clear();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a lesson with a valid token', async () => {
    const token = await loginAsAdmin();
    const payload = createLessonPayload();
    const response = await request(app)
      .post('/api/lessons')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    createdLessonIds.add(response.body.id);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      content: payload.content,
      notes: payload.notes
    });
    expect(response.body).toHaveProperty('id');
  });

  it('should list lessons successfully', async () => {
    const token = await loginAsAdmin();
    const payload = createLessonPayload();
    const createdResponse = await request(app)
      .post('/api/lessons')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    createdLessonIds.add(createdResponse.body.id);

    const response = await request(app).get('/api/lessons');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should find a lesson by id', async () => {
    const token = await loginAsAdmin();
    const payload = createLessonPayload();
    const createdResponse = await request(app)
      .post('/api/lessons')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    createdLessonIds.add(createdResponse.body.id);

    const response = await request(app).get(`/api/lessons/${createdResponse.body.id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdResponse.body.id);
  });

  it('should update a lesson successfully', async () => {
    const token = await loginAsAdmin();
    const payload = createLessonPayload();
    const createdResponse = await request(app)
      .post('/api/lessons')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    createdLessonIds.add(createdResponse.body.id);

    const response = await request(app)
      .put(`/api/lessons/${createdResponse.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Updated lesson content',
        notes: 'Updated notes'
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: createdResponse.body.id,
      content: 'Updated lesson content',
      notes: 'Updated notes'
    });
  });

  it('should delete a lesson successfully', async () => {
    const token = await loginAsAdmin();
    const payload = createLessonPayload();
    const createdResponse = await request(app)
      .post('/api/lessons')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    const response = await request(app)
      .delete(`/api/lessons/${createdResponse.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);

    const lesson = await prisma.lesson.findUnique({
      where: {
        id: createdResponse.body.id
      }
    });

    expect(lesson).toBeNull();
  });

  it('should return 400 when creating a lesson with invalid data', async () => {
    const token = await loginAsAdmin();
    const response = await request(app)
      .post('/api/lessons')
      .set('Authorization', `Bearer ${token}`)
      .send({
        date: 'invalid-date',
        content: 'abc',
        notes: 'a'.repeat(256)
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(response.body.details).toHaveProperty('fieldErrors');
  });

  it('should return 401 when creating a lesson without token', async () => {
    const response = await request(app).post('/api/lessons').send(createLessonPayload());

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Authentication required',
      details: null
    });
  });

  it('should return 404 when finding a non-existing lesson', async () => {
    const response = await request(app).get(`/api/lessons/${createNonExistingLessonId()}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Lesson not found',
      details: null
    });
  });
});
