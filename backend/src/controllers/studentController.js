// Aage kya hai
import { Course, Enrollment, Attendance, User } from '../models/index.js';

// Get courses for student (filtered by stream)
export const getCourses = async (req, res) => {
  try {
    const studentId = req.user.id;
    const student = await User.findByPk(studentId);

    if (!student || student.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const courses = await Course.findAll({
        where: { stream: student.stream },
        include: [
          {
            model: User,
            as: 'teacher',
            attributes: ['id', 'fullName', 'email']
          },
          {
            model: Enrollment,
            as: 'enrollments',
            where: { studentId },
            required: false,
            attributes: ['id']
          }
        ]
    });

      // Add enrolled boolean for convenience in frontend
      const mapped = courses.map(c => ({
        ...c.get({ plain: true }),
        enrolled: Array.isArray(c.enrollments) && c.enrollments.length > 0
      }));

      res.json({ courses: mapped });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Enroll in a course
export const enroll = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.params; // courseId comes from URL param

    const student = await User.findByPk(studentId);
    if (!student || student.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.stream !== student.stream) {
      return res.status(400).json({ message: 'Course stream does not match student stream' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      where: { studentId, courseId }
    });
    if (existingEnrollment) {
      return res.status(409).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({ studentId, courseId });

    res.status(201).json({
      message: 'Enrolled successfully',
      enrollment
    });
  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get student's attendance
export const getAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;

    const attendances = await Attendance.findAll({
      where: { studentId },
      include: [{
        model: Course,
        attributes: ['id', 'title', 'subject']
      }]
    });

    res.json({ attendances });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
