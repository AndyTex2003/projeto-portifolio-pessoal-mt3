import request from 'supertest';

import { prisma } from '../../src/config/prisma.js';
import { app } from '../../src/app.js';

const createdStudentEmails = new Set();
const createdLessonIds = new Set();
const createdProgressIds = new Set();

const createStudentPayload = () => {
  const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    fullName: `Aluno Progresso ${uniqueSuffix}`,
    email: `progresso.${uniqueSuffix}@escola.com`,
    phone: '11999999999',
    currentLevel: 'BEGINNER',
    birthDate: '2005-05-10',
    notes: 'Aluno criado para teste de progresso',
    isActive: true,
    enrollmentDate: '2026-04-23'
  };
};

const createLessonPayload = () => ({
  date: new Date().toISOString(),
  content: `Progress lesson ${Date.now()} ${Math.random().toString(36).slice(2, 8)}`,
  notes: 'Lesson for progress tests'
});

const createNonExistingId = (fillCharacter) => {
  const randomSuffix = Math.random().toString(36).slice(2, 26).padEnd(24, fillCharacter);

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

const createStudent = async (token, currentLevel = 'BEGINNER') => {
  const payload = {
    ...createStudentPayload(),
    currentLevel
  };
  const response = await request(app)
    .post('/api/students')
    .set('Authorization', `Bearer ${token}`)
    .send(payload);

  expect(response.status).toBe(201);
  createdStudentEmails.add(payload.email);

  return response.body;
};

const createLesson = async (token) => {
  const payload = createLessonPayload();
  const response = await request(app)
    .post('/api/lessons')
    .set('Authorization', `Bearer ${token}`)
    .send(payload);

  expect(response.status).toBe(201);
  createdLessonIds.add(response.body.id);

  return response.body;
};

describe('Progress integration tests', () => {
  afterEach(async () => {
    if (createdProgressIds.size > 0) {
      await prisma.progress.deleteMany({
        where: {
          id: {
            in: Array.from(createdProgressIds)
          }
        }
      });
    }

    if (createdLessonIds.size > 0) {
      await prisma.lesson.deleteMany({
        where: {
          id: {
            in: Array.from(createdLessonIds)
          }
        }
      });
    }

    if (createdStudentEmails.size > 0) {
      await prisma.student.deleteMany({
        where: {
          email: {
            in: Array.from(createdStudentEmails)
          }
        }
      });
    }

    createdProgressIds.clear();
    createdLessonIds.clear();
    createdStudentEmails.clear();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a progress entry and promote the student automatically', async () => {
    const token = await loginAsAdmin();
    const student = await createStudent(token, 'BEGINNER');
    const lesson = await createLesson(token);

    const response = await request(app)
      .post('/api/progress')
      .set('Authorization', `Bearer ${token}`)
      .send({
        studentId: student.id,
        lessonId: lesson.id,
        grade: 90,
        present: true,
        comment: 'Great class'
      });

    createdProgressIds.add(response.body.id);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      studentId: student.id,
      lessonId: lesson.id,
      grade: 90,
      present: true,
      comment: 'Great class'
    });
    expect(response.body.student.currentLevel).toBe('INTERMEDIATE');
  });

  it('should not promote the student when business rules are not met', async () => {
    const token = await loginAsAdmin();
    const student = await createStudent(token, 'INTERMEDIATE');
    const lesson = await createLesson(token);

    const response = await request(app)
      .post('/api/progress')
      .set('Authorization', `Bearer ${token}`)
      .send({
        studentId: student.id,
        lessonId: lesson.id,
        grade: 60,
        present: false,
        comment: 'Needs improvement'
      });

    createdProgressIds.add(response.body.id);

    expect(response.status).toBe(201);
    expect(response.body.student.currentLevel).toBe('INTERMEDIATE');
  });

  it('should not exceed the fluent level', async () => {
    const token = await loginAsAdmin();
    const student = await createStudent(token, 'FLUENT');
    const lesson = await createLesson(token);

    const response = await request(app)
      .post('/api/progress')
      .set('Authorization', `Bearer ${token}`)
      .send({
        studentId: student.id,
        lessonId: lesson.id,
        grade: 100,
        present: true,
        comment: 'Already fluent'
      });

    createdProgressIds.add(response.body.id);

    expect(response.status).toBe(201);
    expect(response.body.student.currentLevel).toBe('FLUENT');
  });

  it('should list progress entries successfully', async () => {
    const token = await loginAsAdmin();
    const student = await createStudent(token);
    const lesson = await createLesson(token);
    const createdResponse = await request(app)
      .post('/api/progress')
      .set('Authorization', `Bearer ${token}`)
      .send({
        studentId: student.id,
        lessonId: lesson.id,
        grade: 80,
        present: true,
        comment: 'Good participation'
      });

    createdProgressIds.add(createdResponse.body.id);

    const response = await request(app).get('/api/progress');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should find a progress entry by id', async () => {
    const token = await loginAsAdmin();
    const student = await createStudent(token);
    const lesson = await createLesson(token);
    const createdResponse = await request(app)
      .post('/api/progress')
      .set('Authorization', `Bearer ${token}`)
      .send({
        studentId: student.id,
        lessonId: lesson.id,
        grade: 80,
        present: true
      });

    createdProgressIds.add(createdResponse.body.id);

    const response = await request(app).get(`/api/progress/${createdResponse.body.id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdResponse.body.id);
  });

  it('should return 400 when creating progress with invalid data', async () => {
    const token = await loginAsAdmin();
    const response = await request(app)
      .post('/api/progress')
      .set('Authorization', `Bearer ${token}`)
      .send({
        studentId: 'invalid-id',
        lessonId: 'invalid-id',
        grade: 120,
        present: 'yes'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(response.body.details).toHaveProperty('fieldErrors');
  });

  it('should return 401 when creating progress without token', async () => {
    const response = await request(app).post('/api/progress').send({
      studentId: createNonExistingId('c'),
      lessonId: createNonExistingId('d'),
      grade: 80,
      present: true
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Authentication required',
      details: null
    });
  });

  it('should return 404 when creating progress with a non-existing student', async () => {
    const token = await loginAsAdmin();
    const lesson = await createLesson(token);

    const response = await request(app)
      .post('/api/progress')
      .set('Authorization', `Bearer ${token}`)
      .send({
        studentId: createNonExistingId('e'),
        lessonId: lesson.id,
        grade: 80,
        present: true
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Student not found',
      details: null
    });
  });

  it('should return 404 when finding a non-existing progress entry', async () => {
    const response = await request(app).get(`/api/progress/${createNonExistingId('f')}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Progress not found',
      details: null
    });
  });
});
