import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { sequelize, User, Course, Enrollment, Attendance, NotificationLog } from '../models/index.js';

const hash = (p) => bcrypt.hash(p, 12);

const now = new Date();

const addMinutes = (d, m) => new Date(d.getTime() + m * 60000);
const addHours = (d, h) => new Date(d.getTime() + h * 60 * 60000);

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('DB connected for seeding');

    let credentialsLog = '';

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
    credentialsLog += `\n=== ADMIN ===\nEmail: admin@eduport.com\nPassword: AdminPass123\n`;

    // Create 10 Teachers
    console.log('Creating 10 teachers...');
    const teachersData = [
      { fullName: 'Alice Johnson', email: 'alice@eduport.com', subject: 'Physics' },
      { fullName: 'Bob Smith', email: 'bob@eduport.com', subject: 'Chemistry' },
      { fullName: 'Carol White', email: 'carol@eduport.com', subject: 'Biology' },
      { fullName: 'David Brown', email: 'david@eduport.com', subject: 'Mathematics' },
      { fullName: 'Emma Davis', email: 'emma@eduport.com', subject: 'English' },
      { fullName: 'Frank Wilson', email: 'frank@eduport.com', subject: 'History' },
      { fullName: 'Grace Lee', email: 'grace@eduport.com', subject: 'Geography' },
      { fullName: 'Henry Martin', email: 'henry@eduport.com', subject: 'Computer Science' },
      { fullName: 'Iris Taylor', email: 'iris@eduport.com', subject: 'Economics' },
      { fullName: 'Jack Anderson', email: 'jack@eduport.com', subject: 'Psychology' }
    ];

    const teacherPromises = teachersData.map(async t => {
      const [u] = await User.findOrCreate({
        where: { email: t.email },
        defaults: {
          fullName: t.fullName,
          passwordHash: await hash('TeacherPass123'),
          role: 'teacher'
        }
      });
      return u;
    });
    const teachers = await Promise.all(teacherPromises);

    credentialsLog += `\n=== TEACHERS (10) ===\n`;
    teachersData.forEach(t => {
      credentialsLog += `Email: ${t.email} | Password: TeacherPass123\n`;
    });

    // Create 30 Students
    console.log('Creating 30 students...');
    const streams = ['PCM', 'PCB', 'Commerce', 'Arts'];
    const firstNames = ['Aarav', 'Bhavna', 'Chirag', 'Deepa', 'Ethan', 'Fiona', 'Gaurav', 'Harsha', 'Ishaan', 'Jasmine',
                        'Kavya', 'Liam', 'Meera', 'Nikhil', 'Olivia', 'Priya', 'Quinn', 'Rohan', 'Sophia', 'Tanya',
                        'Uday', 'Veda', 'Wanda', 'Xavier', 'Yara', 'Zara', 'Aditya', 'Bhumi', 'Chetan', 'Divya'];
    const lastNames = ['Patel', 'Kumar', 'Singh', 'Sharma', 'Gupta', 'Verma', 'Nair', 'Pillai', 'Iyer', 'Bhat'];

    const studentsData = [];
    for (let i = 0; i < 30; i++) {
      const firstName = firstNames[i];
      const lastName = lastNames[i % 10];
      const stream = streams[i % 4];
      studentsData.push({
        fullName: `${firstName} ${lastName}`,
        email: `student${i + 1}@eduport.com`,
        stream
      });
    }

    const studentPromises = studentsData.map(async s => {
      const [u] = await User.findOrCreate({
        where: { email: s.email },
        defaults: {
          fullName: s.fullName,
          passwordHash: await hash('StudentPass123'),
          role: 'student',
          stream: s.stream
        }
      });
      return u;
    });
    const students = await Promise.all(studentPromises);

    credentialsLog += `\n=== STUDENTS (30) ===\n`;
    studentsData.forEach(s => {
      credentialsLog += `Email: ${s.email} | Password: StudentPass123 | Stream: ${s.stream}\n`;
    });

    // Create 15 Courses
    console.log('Creating 15 courses...');
    const coursesData = [
      { title: 'Physics 101: Mechanics', description: 'Fundamentals of classical mechanics', subject: 'Physics', stream: 'PCM', teacherId: teachers[0].id },
      { title: 'Physics 102: Thermodynamics', description: 'Heat and thermodynamics basics', subject: 'Physics', stream: 'PCM', teacherId: teachers[0].id },
      { title: 'Chemistry 101: General Chemistry', description: 'Introduction to chemistry', subject: 'Chemistry', stream: 'PCM', teacherId: teachers[1].id },
      { title: 'Chemistry 102: Organic Chemistry', description: 'Fundamentals of organic compounds', subject: 'Chemistry', stream: 'PCM', teacherId: teachers[1].id },
      { title: 'Biology 101: Genetics', description: 'Introduction to genetics and heredity', subject: 'Biology', stream: 'PCB', teacherId: teachers[2].id },
      { title: 'Biology 102: Ecology', description: 'Ecosystems and ecology concepts', subject: 'Biology', stream: 'PCB', teacherId: teachers[2].id },
      { title: 'Mathematics 101: Calculus', description: 'Differential and integral calculus', subject: 'Mathematics', stream: 'PCM', teacherId: teachers[3].id },
      { title: 'Mathematics 102: Algebra', description: 'Advanced algebra concepts', subject: 'Mathematics', stream: 'PCM', teacherId: teachers[3].id },
      { title: 'English 101: Literature', description: 'Classic and modern literature', subject: 'English', stream: 'Arts', teacherId: teachers[4].id },
      { title: 'History 101: Ancient Civilizations', description: 'History of ancient empires', subject: 'History', stream: 'Arts', teacherId: teachers[5].id },
      { title: 'Geography 101: World Geography', description: 'Physical and human geography', subject: 'Geography', stream: 'Arts', teacherId: teachers[6].id },
      { title: 'Computer Science 101: Programming', description: 'Introduction to programming', subject: 'Computer Science', stream: 'PCM', teacherId: teachers[7].id },
      { title: 'Economics 101: Microeconomics', description: 'Individual and firm economics', subject: 'Economics', stream: 'Commerce', teacherId: teachers[8].id },
      { title: 'Economics 102: Macroeconomics', description: 'National and global economics', subject: 'Economics', stream: 'Commerce', teacherId: teachers[8].id },
      { title: 'Psychology 101: Fundamentals', description: 'Introduction to psychology', subject: 'Psychology', stream: 'Arts', teacherId: teachers[9].id }
    ];

    const coursePromises = coursesData.map(async (c, idx) => {
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const startTime = addHours(tomorrow, 9 + Math.floor(idx / 3)); // spread courses across different times
      const [course] = await Course.findOrCreate({
        where: { title: c.title },
        defaults: {
          ...c,
          startTime,
          endTime: addMinutes(startTime, 60)
        }
      });
      return course;
    });
    const courses = await Promise.all(coursePromises);

    console.log('Enrolling students in courses...');
    // Enroll students in courses based on their stream
    for (const student of students) {
      for (const course of courses) {
        // Enroll if stream matches or course has no stream restriction
        if (!course.stream || course.stream === student.stream) {
          await Enrollment.findOrCreate({
            where: { studentId: student.id, courseId: course.id }
          });
        }
      }
    }

    console.log('Creating attendance records...');
    // Create attendance entries
    const today = new Date();
    const dateOnly = today.toISOString().slice(0, 10);
    for (const course of courses) {
      const enrolls = await Enrollment.findAll({ where: { courseId: course.id } });
      for (let i = 0; i < enrolls.length; i++) {
        const e = enrolls[i];
        const status = i % 3 === 0 ? 'ABSENT' : 'PRESENT'; // 1/3 absent, 2/3 present
        await Attendance.findOrCreate({
          where: { courseId: course.id, studentId: e.studentId, date: dateOnly },
          defaults: {
            courseId: course.id,
            studentId: e.studentId,
            date: dateOnly,
            status,
            markedBy: teachers[0].id
          }
        });
      }
    }

    console.log('Seeding complete');
    credentialsLog += `\n=== COURSES CREATED ===\n`;
    coursesData.forEach((c, i) => {
      credentialsLog += `${i + 1}. ${c.title} (${c.subject}, ${c.stream || 'All Streams'})\n`;
    });
    credentialsLog += `\n=== SUMMARY ===\n1 Admin\n10 Teachers\n30 Students\n15 Courses\nAll students enrolled in matching stream courses\n`;

    // Save credentials to file
    const credFilePath = path.join(process.cwd(), 'CREDENTIALS.txt');
    fs.writeFileSync(credFilePath, credentialsLog);
    console.log(`\n✅ Credentials saved to CREDENTIALS.txt`);
    console.log(credentialsLog);

    process.exit(0);
  } catch (err) {
    console.error('Seeding error', err);
    process.exit(1);
  }
}

seed();
