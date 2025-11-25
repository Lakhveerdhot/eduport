import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { User, Course, Enrollment } from '../models/index.js';
import { config } from '../config/env.js';
import { NotificationLog } from '../models/index.js';

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['passwordHash'] }
    });
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { fullName, email, password, role, stream } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      fullName,
      email,
      passwordHash,
      role,
      stream: role === 'student' ? stream : null
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        stream: user.stream
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, role, stream } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is being changed and if it's already taken
    if (email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already in use' });
      }
    }

    await user.update({
      fullName,
      email,
      role,
      stream: role === 'student' ? stream : null
    });

    res.json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        stream: user.stream
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Test notification endpoint: sends reminder email for a course immediately
export const testNotification = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Get course details
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Get enrolled students
    const enrollments = await Enrollment.findAll({
      where: { courseId },
      include: [{ model: User, as: 'student', attributes: ['id', 'fullName', 'email'] }]
    });

    const recipients = enrollments.map(e => e.student?.email).filter(Boolean);

    if (recipients.length === 0) {
      return res.status(400).json({ message: 'No enrolled students to notify' });
    }

    // Check if SMTP is configured
    if (!config.email || !config.email.smtp || !config.email.smtp.host) {
      return res.status(400).json({ message: 'SMTP not configured. Add SMTP_* env vars.' });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: config.email.smtp.host,
      port: config.email.smtp.port || 587,
      secure: !!config.email.smtp.secure,
      auth: config.email.smtp.user ? { user: config.email.smtp.user, pass: config.email.smtp.pass } : undefined
    });

    // Send test email
    const from = config.email.from || `no-reply@${config.email.smtp.host}`;
    const subject = `Test Reminder: "${course.title}" is starting soon`;
    const text = `This is a test notification.\n\nCourse: ${course.title}\nStartTime: ${course.startTime}\n\nPlease join the class on time.`;

    await transporter.sendMail({
      from,
      to: recipients.join(','),
      subject,
      text
    });

    console.log(`Test notification sent for course ${courseId} to ${recipients.length} recipients`);
    res.json({
      message: 'Test notification sent successfully',
      recipients: recipients.length,
      emails: recipients
    });
  } catch (error) {
    console.error('Test notification error:', error);
    res.status(500).json({ message: 'Error sending test notification', error: error.message });
  }
};
