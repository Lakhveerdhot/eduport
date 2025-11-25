import request from 'supertest';
import app from '../app.js';
import setupTest from './setupTest.js';

let studentToken;

beforeAll(async () => {
  await setupTest();

  // create a teacher and a course
  await request(app)
    .post('/auth/signup')
    .send({ fullName: 'Teacher A', email: 'ta@example.com', password: 'Password123', role: 'teacher' });

  const tLogin = await request(app)
    .post('/auth/login')
    .send({ email: 'ta@example.com', password: 'Password123' });

  const tToken = tLogin.body.token;

  await request(app)
    .post('/teacher/courses')
    .set('Authorization', `Bearer ${tToken}`)
    .send({ title: 'Chemistry', description: 'Chem', subject: 'Chemistry', stream: 'PCM', startTime: new Date().toISOString(), endTime: new Date(Date.now() + 3600 * 1000).toISOString() });

  // create student
  await request(app)
    .post('/auth/signup')
    .send({ fullName: 'Student B', email: 'sb@example.com', password: 'Password123', role: 'student', stream: 'PCM' });

  const sLogin = await request(app)
    .post('/auth/login')
    .send({ email: 'sb@example.com', password: 'Password123' });

  studentToken = sLogin.body.token;
});

describe('Student', () => {
  it('should return courses for student stream', async () => {
    const res = await request(app)
      .get('/student/courses')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.courses)).toBe(true);
    expect(res.body.courses.length).toBeGreaterThan(0);
  });
});
