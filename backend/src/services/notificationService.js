/**
 * Notification Service
 * --------------------
 * Runs a cron job every minute to find courses starting in ~15 minutes
 * and notifies enrolled students via email (if SMTP configured).
 *
 * The service writes a record to NotificationLog to avoid duplicate sends.
 */
import cron from 'node-cron';
import nodemailer from 'nodemailer';
import { Course, NotificationLog, Enrollment, User } from '../models/index.js';
import { Op } from 'sequelize';
import { config } from '../config/env.js';

// Function to check and send notifications
const checkAndSendNotifications = async () => {
  try {
    const now = new Date();
    const fifteenMinutesFromNow = new Date(now.getTime() + 15 * 60 * 1000);

    // Find courses starting within the next 15 minutes
    const upcomingCourses = await Course.findAll({
      where: {
        startTime: {
          [Op.gte]: now,
          [Op.lt]: fifteenMinutesFromNow
        }
      }
    });

    for (const course of upcomingCourses) {
      // Skip if we've already logged a notification for this scheduled time
      const existingNotification = await NotificationLog.findOne({
        where: { courseId: course.id, scheduledTime: course.startTime }
      });

      if (existingNotification) continue;

      // Record the notification so we don't re-send
      await NotificationLog.create({
        courseId: course.id,
        scheduledTime: course.startTime,
        notificationTime: now
      });

      // Send emails to enrolled students if SMTP configured
      try {
        const enrollments = await Enrollment.findAll({
          where: { courseId: course.id },
          include: [{ model: User, as: 'student', attributes: ['id', 'fullName', 'email'] }]
        });

        const recipients = enrollments.map(e => e.student?.email).filter(Boolean);

        if (recipients.length > 0 && config.email && config.email.smtp && config.email.smtp.host) {
          const transporter = nodemailer.createTransport({
            host: config.email.smtp.host,
            port: config.email.smtp.port || 587,
            secure: !!config.email.smtp.secure,
            auth: config.email.smtp.user ? { user: config.email.smtp.user, pass: config.email.smtp.pass } : undefined
          });

          const from = config.email.from || `no-reply@${config.email.smtp.host}`;
          const subject = `Reminder: "${course.title}" starts in 15 minutes`;
          const text = `Your class "${course.title}" starts at ${course.startTime} (server time). Please join on time.`;

          await transporter.sendMail({ from, to: recipients.join(','), subject, text });
          console.log(`Email notifications sent for course ${course.id} to ${recipients.length} recipients.`);
        } else {
          console.log(`Notification (no SMTP): Class "${course.title}" starts at ${course.startTime}. Would notify: ${recipients.join(',')}`);
        }
      } catch (mailErr) {
        console.error('Error sending notification emails:', mailErr);
      }
    }
  } catch (error) {
    console.error('Error in notification service:', error);
  }
};

// Start the cron job to run every minute
export const startNotificationScheduler = () => {
  cron.schedule('* * * * *', checkAndSendNotifications);
  console.log('Notification scheduler started - checking every minute');
};
