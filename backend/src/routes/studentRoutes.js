import express from 'express';
import { getCourses, enroll, getAttendance } from '../controllers/studentController.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import { validate } from '../middlewares/validation.js';
import { enrollSchema } from '../middlewares/validation.js';

const router = express.Router();

// All student routes require authentication and student role
router.use(verifyToken);
router.use(requireRole('student'));

router.get('/courses', getCourses);
router.post('/courses/:courseId/enroll', enroll);
router.get('/attendance', getAttendance);

export default router;
