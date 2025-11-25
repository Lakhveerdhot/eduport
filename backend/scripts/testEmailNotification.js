/**
 * Test Email Notification Script
 * This script tests the email notification system by:
 * 1. Creating a test course starting ~15 minutes from now
 * 2. Creating a test student and enrolling them
 * 3. Logging in as admin
 * 4. Calling the test notification endpoint to send email immediately
 */

import http from 'http';
import { sequelize, User, Course, Enrollment } from '../src/models/index.js';

const API_BASE = 'http://localhost:4000/api';

const log = (msg, type = 'info') => {
  const icons = { info: 'ℹ️', success: '✅', error: '❌', warn: '⚠️' };
  console.log(`${icons[type]} ${msg}`);
};

// Helper to make HTTP requests
const httpRequest = (method, path, body = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data)
          });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
};

const testEmailNotification = async () => {
  try {
    log('Starting email notification test...', 'info');

    // Step 1: Connect to database
    log('Connecting to database...', 'info');
    await sequelize.authenticate();
    log('Database connected', 'success');

    // Step 2: Create test student
    log('Creating test student...', 'info');
    const bcrypt = await import('bcryptjs');
    const hash = await bcrypt.default.hash('TestPass123', 12);
    const [testStudent, studentCreated] = await User.findOrCreate({
      where: { email: 'teststudent@eduport.com' },
      defaults: {
        fullName: 'Test Student',
        passwordHash: hash,
        role: 'student',
        stream: 'PCM'
      }
    });
    log(`Test student ${studentCreated ? 'created' : 'found'}: ${testStudent.email}`, 'success');

    // Step 3: Create test teacher
    log('Creating test teacher...', 'info');
    const teacherHash = await bcrypt.default.hash('TeacherPass1', 12);
    const [testTeacher] = await User.findOrCreate({
      where: { email: 'testteacher@eduport.com' },
      defaults: {
        fullName: 'Test Teacher',
        passwordHash: teacherHash,
        role: 'teacher',
        stream: null
      }
    });
    log(`Test teacher: ${testTeacher.email}`, 'success');

    // Step 4: Create test course starting 15 minutes from now
    log('Creating test course (starts in ~15 minutes)...', 'info');
    const now = new Date();
    const courseStart = new Date(now.getTime() + 15 * 60 * 1000);
    const courseEnd = new Date(courseStart.getTime() + 60 * 60 * 1000);

    const [testCourse, courseCreated] = await Course.findOrCreate({
      where: { title: `Test Email Course ${Date.now()}` },
      defaults: {
        title: `Test Email Course ${Date.now()}`,
        description: 'Test course for email notification',
        subject: 'Test',
        stream: 'PCM',
        teacherId: testTeacher.id,
        startTime: courseStart,
        endTime: courseEnd
      }
    });
    log(`Test course ${courseCreated ? 'created' : 'found'}: ${testCourse.title}`, 'success');
    log(`  → Starts at: ${courseStart.toLocaleString()}`, 'info');

    // Step 5: Enroll student
    log('Enrolling student in course...', 'info');
    const [enrollment, enrollmentCreated] = await Enrollment.findOrCreate({
      where: { studentId: testStudent.id, courseId: testCourse.id }
    });
    log(`Student ${enrollmentCreated ? 'enrolled' : 'already enrolled'}`, 'success');

    // Step 6: Login as admin
    log('Logging in as admin...', 'info');
    let adminToken;
    try {
      const loginRes = await httpRequest('POST', '/auth/login', {
        email: 'admin@eduport.com',
        password: 'AdminPass123'
      });
      
      if (loginRes.status !== 200) {
        console.log('Login response:', JSON.stringify(loginRes, null, 2));
        throw new Error(loginRes.data?.message || `HTTP ${loginRes.status}`);
      }
      
      adminToken = loginRes.data.token;
      log('Admin login successful', 'success');
    } catch (err) {
      log(`Admin login failed: ${err.message}`, 'error');
      log('Make sure admin@eduport.com exists with password AdminPass123', 'warn');
      process.exit(1);
    }

    // Step 7: Test notification endpoint
    log(`Testing notification endpoint for course ${testCourse.id}...`, 'info');
    try {
      const notifRes = await httpRequest(
        'POST',
        `/admin/notify-now/${testCourse.id}`,
        {},
        { Authorization: `Bearer ${adminToken}` }
      );

      if (notifRes.status !== 200) {
        throw new Error(notifRes.data?.message || `HTTP ${notifRes.status}`);
      }

      log('✨ Email notification sent successfully!', 'success');
      log(`Recipients count: ${notifRes.data.recipients}`, 'success');
      log(`Recipient emails: ${notifRes.data.emails.join(', ')}`, 'success');

      log('', 'info');
      log('📧 Check Mailtrap inbox at https://mailtrap.io to see the test email', 'info');
      log('', 'info');
    } catch (err) {
      log(`Notification endpoint failed: ${err.message}`, 'error');
      process.exit(1);
    }

    log('✅ Test completed successfully!', 'success');
    process.exit(0);
  } catch (error) {
    log(`Test failed: ${error.message}`, 'error');
    console.error(error);
    process.exit(1);
  }
};

testEmailNotification();
