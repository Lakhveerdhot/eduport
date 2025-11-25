import bcrypt from 'bcryptjs';
import { sequelize, User, Course, Enrollment, Attendance, NotificationLog } from '../models/index.js';

const hash = (p) => bcrypt.hash(p, 12);

const now = new Date();

const addMinutes = (d, m) => new Date(d.getTime() + m * 60000);

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('DB connected for seeding');

    // Create admin
    const [admin] = await User.findOrCreate({
      where: { email: 'admin@eduport.com' },
      defaults: {
        fullName: 'Admin User',
        passwordHash: await hash('AdminPass123'),
        role: 'admin',
        stream: null
      }
    });

    // Teachers
    const teachersData = [
      { fullName: 'Alice Teacher', email: 'alice@eduport.com' },
      { fullName: 'Bob Teacher', email: 'bob@eduport.com' }
    ];

    const teacherPromises = teachersData.map(async t => {
      const [u] = await User.findOrCreate({ where: { email: t.email }, defaults: { fullName: t.fullName, passwordHash: await hash('TeacherPass1'), role: 'teacher' } });
      return u;
    });
    const teachers = await Promise.all(teacherPromises);

    // Students
    const studentsData = [
      { fullName: 'Charlie Student', email: 'charlie@student.com', stream: 'PCM' },
      { fullName: 'Dana Student', email: 'dana@student.com', stream: 'PCM' },
      { fullName: 'Evan Student', email: 'evan@student.com', stream: 'PCB' },
      { fullName: 'Fiona Student', email: 'fiona@student.com', stream: 'Commerce' }
    ];

    const studentPromises = studentsData.map(async s => {
      const [u] = await User.findOrCreate({ where: { email: s.email }, defaults: { fullName: s.fullName, passwordHash: await hash('StudentPass1'), role: 'student', stream: s.stream } });
      return u;
    });
    const students = await Promise.all(studentPromises);

    // Create courses
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10, 0, 0);
    const coursesData = [
      { title: 'Physics 101', description: 'Intro to Physics', subject: 'Physics', stream: 'PCM', teacherId: teachers[0].id, startTime: tomorrow, endTime: addMinutes(tomorrow, 60) },
      { title: 'Chemistry Basics', description: 'Fundamental Chemistry', subject: 'Chemistry', stream: 'PCM', teacherId: teachers[1].id, startTime: addMinutes(tomorrow, 120), endTime: addMinutes(tomorrow, 180) },
      { title: 'Biology Intro', description: 'Basics of Biology', subject: 'Biology', stream: 'PCB', teacherId: teachers[1].id, startTime: addMinutes(tomorrow, 240), endTime: addMinutes(tomorrow, 300) }
    ];

    const coursePromises = coursesData.map(async c => {
      const [course] = await Course.findOrCreate({ where: { title: c.title }, defaults: c });
      return course;
    });
    const courses = await Promise.all(coursePromises);

    // Enroll students: enroll PCM students to the PCM courses
    for (const student of students) {
      for (const course of courses) {
        if (course.stream === student.stream) {
          await Enrollment.findOrCreate({ where: { studentId: student.id, courseId: course.id } });
        }
      }
    }

    // Create attendance entries for today for some students
    const today = new Date();
    const dateOnly = today.toISOString().slice(0,10);
    for (const course of courses) {
      // mark first enrolled student as PRESENT and second as ABSENT when applicable
      const enrolls = await Enrollment.findAll({ where: { courseId: course.id } });
      for (let i=0;i<enrolls.length;i++){
        const e = enrolls[i];
        const status = i % 2 === 0 ? 'PRESENT' : 'ABSENT';
        await Attendance.findOrCreate({ where: { courseId: course.id, studentId: e.studentId, date: dateOnly }, defaults: { courseId: course.id, studentId: e.studentId, date: dateOnly, status, markedBy: teachers[0].id } });
      }
    }

    // Create a NotificationLog for the first course scheduled time
    if (courses[0]) {
      const scheduledTime = courses[0].startTime;
      const notificationTime = addMinutes(scheduledTime, -15);
      await NotificationLog.findOrCreate({ where: { courseId: courses[0].id, scheduledTime }, defaults: { courseId: courses[0].id, scheduledTime, notificationTime } });
    }

    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error', err);
    process.exit(1);
  }
}

seed();
