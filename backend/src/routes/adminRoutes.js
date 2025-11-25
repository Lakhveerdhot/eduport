import express from 'express';
import { getUsers, createUser, updateUser, deleteUser, testNotification } from '../controllers/adminController.js';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import { validate } from '../middlewares/validation.js';
import { signupSchema } from '../middlewares/validation.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(verifyToken);
router.use(requireRole('admin'));

router.get('/users', getUsers);
router.post('/users', validate(signupSchema), createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Test notification endpoint
router.post('/notify-now/:courseId', testNotification);

export default router;
