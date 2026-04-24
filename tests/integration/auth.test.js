import request from 'supertest';

import { app } from '../../src/app.js';

describe('Auth integration tests', () => {
  it('should login successfully and return a token', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'admin@escola.com',
      password: 'admin123'
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(typeof response.body.token).toBe('string');
    expect(response.body.token.length).toBeGreaterThan(0);
  });

  it('should return 401 when password is invalid', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'admin@escola.com',
      password: 'senha-invalida'
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Invalid email or password',
      details: null
    });
  });

  it('should return 401 when email does not exist', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'inexistente@escola.com',
      password: 'admin123'
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Invalid email or password',
      details: null
    });
  });

  it('should return 400 when login payload is invalid', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'email-invalido'
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(response.body.details).toHaveProperty('fieldErrors');
    expect(response.body.details.fieldErrors).toHaveProperty('body');
  });
});
