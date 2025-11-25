/**
 * Quick test to send email directly via Mailtrap
 */
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 587,
  secure: false,
  auth: {
    user: 'eaae095e3b7c19',
    pass: '85cc778da09055'
  }
});

const testEmail = async () => {
  try {
    console.log('Sending test email...');
    const result = await transporter.sendMail({
      from: 'Eduport <no-reply@eduport.test>',
      to: 'test@example.com',
      subject: 'Eduport Test Email - Notification Works! 🎉',
      text: 'This is a test email from Eduport notification system.\n\nIf you see this, email sending is working correctly!\n\nCourse: Test Course\nStarts at: 2025-11-25 03:25 PM\n\nPlease join on time.'
    });
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', result.messageId);
    console.log('\n📧 Check Mailtrap inbox at https://mailtrap.io to see the test email');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testEmail();
