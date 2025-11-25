import request from 'supertest';
import app from '../app.js';
import setupTest from './setupTest.js';

let teacherToken;

beforeAll(async () => {
  await setupTest();

  // create a teacher
  await request(app)
    .post('/auth/signup')
    .send({ fullName: 'Test Teacher', email: 'teacher@example.com', password: 'Password123', role: 'teacher' });

  const login = await request(app)
    .post('/auth/login')
    .send({ email: 'teacher@example.com', password: 'Password123' });

  teacherToken = login.body.token;
});

describe('Teacher', () => {
  it('should create a course', async () => {
    const res = await request(app)
      .post('/teacher/courses')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ title: 'Physics 101', description: 'Intro', subject: 'Physics', stream: 'PCM', startTime: new Date().toISOString(), endTime: new Date(Date.now() + 3600 * 1000).toISOString() });

    expect(res.status).toBe(201);
    expect(res.body.course.title).toBe('Physics 101');
  });
});
