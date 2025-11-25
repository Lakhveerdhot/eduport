import { sequelize } from '../config/database.js';
import User from './User.js';
import Course from './Course.js';
import Enrollment from './Enrollment.js';
import Attendance from './Attendance.js';
import NotificationLog from './NotificationLog.js';

// Define relationships
User.hasMany(Course, { foreignKey: 'teacherId', as: 'courses' });
Course.belongsTo(User, { foreignKey: 'teacherId', as: 'teacher' });

User.hasMany(Enrollment, { foreignKey: 'studentId', as: 'enrollments' });
Course.hasMany(Enrollment, { foreignKey: 'courseId', as: 'enrollments' });
Enrollment.belongsTo(User, { foreignKey: 'studentId', as: 'student' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

User.hasMany(Attendance, { foreignKey: 'studentId', as: 'attendances' });
Course.hasMany(Attendance, { foreignKey: 'courseId', as: 'attendances' });
User.hasMany(Attendance, { foreignKey: 'markedBy', as: 'markedAttendances' });
Attendance.belongsTo(User, { foreignKey: 'studentId', as: 'student' });
Attendance.belongsTo(Course, { foreignKey: 'courseId', as: 'Course' });
Attendance.belongsTo(User, { foreignKey: 'markedBy', as: 'markedByUser' });

Course.hasMany(NotificationLog, { foreignKey: 'courseId', as: 'notifications' });
NotificationLog.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

export { sequelize, User, Course, Enrollment, Attendance, NotificationLog };
