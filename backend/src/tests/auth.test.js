import request from 'supertest';
import app from '../app.js';
import setupTest from './setupTest.js';

beforeAll(async () => {
  await setupTest();
});

describe('Auth', () => {
  it('should signup a student', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({ fullName: 'Test Student', email: 'student@example.com', password: 'Password123', role: 'student', stream: 'PCM' });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('student@example.com');
  });

  it('should login the student', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'student@example.com', password: 'Password123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('student@example.com');
  });
});
