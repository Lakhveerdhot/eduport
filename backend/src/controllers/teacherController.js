import { Course, User, Attendance } from '../models/index.js';

// Create a course
export const createCourse = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { title, description, subject, stream, startTime, endTime } = req.body;

    const course = await Course.create({
      title,
      description,
      subject,
      stream,
      teacherId,
      startTime,
      endTime
    });

    res.status(201).json({ course });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// List courses for teacher
export const getTeacherCourses = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const courses = await Course.findAll({ where: { teacherId } });
    res.json({ courses });
  } catch (error) {
    console.error('Get teacher courses error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update course
export const updateCourse = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { id } = req.params;
    const course = await Course.findByPk(id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.teacherId !== teacherId) return res.status(403).json({ message: 'Forbidden' });

    await course.update(req.body);
    res.json({ course });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { id } = req.params;
    const course = await Course.findByPk(id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.teacherId !== teacherId) return res.status(403).json({ message: 'Forbidden' });

    await course.destroy();
    res.json({ message: 'Course deleted' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Mark attendance for a course (teacher)
export const markAttendance = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { courseId } = req.params;
    const { date, attendances } = req.body;

    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.teacherId !== teacherId) return res.status(403).json({ message: 'Forbidden' });

    // Upsert attendance rows
    const results = [];
    for (const a of attendances) {
      const [record, created] = await Attendance.upsert({
        courseId: course.id,
        studentId: a.studentId,
        date,
        status: a.status,
        markedBy: teacherId
      }, { returning: true });
      results.push(record || created);
    }

    res.json({ message: 'Attendance marked', results });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
