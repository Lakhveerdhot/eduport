import express from 'express';
import rateLimit from 'express-rate-limit';
import { signup, login, me } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/auth.js';
import { validate } from '../middlewares/validation.js';
import { signupSchema, loginSchema } from '../middlewares/validation.js';

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.'
});

router.post('/signup', authLimiter, validate(signupSchema), signup);
router.post('/login', authLimiter, validate(loginSchema), login);
router.get('/me', verifyToken, me);

export default router;
