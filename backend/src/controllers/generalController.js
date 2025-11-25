import { Course, User } from '../models/index.js';

// Get all courses with optional filters
export const getCourses = async (req, res) => {
  try {
    const { stream, subject } = req.query;

    const whereClause = {};
    if (stream) whereClause.stream = stream;
    if (subject) whereClause.subject = subject;

    const courses = await Course.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'teacher',
        attributes: ['id', 'fullName', 'email']
      }]
    });

    res.json({ courses });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get course details by ID
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id, {
      include: [{
        model: User,
        as: 'teacher',
        attributes: ['id', 'fullName', 'email']
      }]
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ course });
  } catch (error) {
    console.error('Get course by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
