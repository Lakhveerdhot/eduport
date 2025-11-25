import express from 'express';
import { createCourse, getTeacherCourses, updateCourse, deleteCourse, markAttendance } from '../controllers/teacherController.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import { validate } from '../middlewares/validation.js';
import { createCourseSchema, attendanceSchema } from '../middlewares/validation.js';

const router = express.Router();

// All teacher routes require authentication and teacher role
router.use(verifyToken);
router.use(requireRole('teacher'));

router.post('/courses', validate(createCourseSchema), createCourse);
router.get('/courses', getTeacherCourses);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);
router.post('/courses/:courseId/attendance', validate(attendanceSchema), markAttendance);

export default router;
