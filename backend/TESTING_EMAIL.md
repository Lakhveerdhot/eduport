# Email Notification Testing Guide

## Quick Setup

### 1. Start Backend with SMTP Config
```powershell
cd 'E:\eduport\backend'
npm run dev
```

Wait for these logs:
```
Database connected
Database synced
Notification scheduler started - checking every minute
```

### 2. Run Automatic Test Script
```powershell
# In another terminal
cd 'E:\eduport\backend'
node scripts/testEmailNotification.js
```

This script will:
- Create a test student (teststudent@eduport.com)
- Create a test course starting in 15 minutes
- Enroll the student
- Login as admin
- Send a test email immediately

Expected output:
```
✅ Email notification sent successfully!
Recipients count: 1
Recipient emails: teststudent@eduport.com
📧 Check Mailtrap inbox at https://mailtrap.io to see the test email
```

---

## Manual Testing (Step-by-Step)

### Step 1: Ensure Backend is Running
```powershell
cd 'E:\eduport\backend'
npm run dev
```

Backend should run on `http://localhost:4000`.

### Step 2: Test Database Connection
```powershell
# In a new terminal, test the backend is alive
curl http://localhost:4000/api/auth/login -X POST ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test\",\"password\":\"test\"}"
```

You should get a response (error is fine, means backend is running).

### Step 3: Get Admin JWT Token
```powershell
curl http://localhost:4000/api/auth/login -X POST ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@eduport.com\",\"password\":\"AdminPass123\"}" ^
  -o admin_login.json

# Read the token from admin_login.json file
# Copy TOKEN value
```

Expected response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": { "id": 1, "email": "admin@eduport.com", "role": "admin" }
}
```

### Step 4: Create a Test Course via Database
Use MySQL directly or Sequelize:

```javascript
// backend/scripts/createTestCourse.js
import { sequelize, Course, User } from '../src/models/index.js';

const run = async () => {
  await sequelize.authenticate();
  
  // Get teacher (ID should be 1 if you seeded)
  const teacher = await User.findOne({ where: { role: 'teacher' } });
  
  if (!teacher) {
    console.log('No teacher found. Create one first.');
    process.exit(1);
  }

  const now = new Date();
  const start = new Date(now.getTime() + 15 * 60 * 1000);
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  const course = await Course.create({
    title: 'Manual Test Course ' + Date.now(),
    description: 'For testing email notifications',
    subject: 'Test',
    stream: null,
    teacherId: teacher.id,
    startTime: start,
    endTime: end
  });

  console.log('✅ Course created:');
  console.log(`  ID: ${course.id}`);
  console.log(`  Title: ${course.title}`);
  console.log(`  Starts at: ${start.toLocaleString()}`);
  process.exit(0);
};

run();
```

Run it:
```powershell
cd 'E:\eduport\backend'
node scripts/createTestCourse.js
```

Copy the course ID from output.

### Step 5: Enroll a Student
```javascript
// backend/scripts/enrollStudent.js
import { sequelize, Enrollment, User } from '../src/models/index.js';

const run = async () => {
  await sequelize.authenticate();
  
  // Get a student
  const student = await User.findOne({ where: { role: 'student' } });
  
  if (!student) {
    console.log('No student found. Create one first.');
    process.exit(1);
  }

  const courseId = 1; // Replace with your course ID from step 4
  
  const enrollment = await Enrollment.findOrCreate({
    where: { studentId: student.id, courseId }
  });

  console.log(`✅ Student enrolled:`);
  console.log(`  Student: ${student.email}`);
  console.log(`  Course ID: ${courseId}`);
  process.exit(0);
};

run();
```

Run it:
```powershell
node scripts/enrollStudent.js
```

### Step 6: Call Test Notification Endpoint
Replace `TOKEN` with your JWT token and `COURSE_ID` with course ID from step 4:

```powershell
$TOKEN = "paste_your_jwt_token_here"
$COURSE_ID = "1"

curl "http://localhost:4000/api/admin/notify-now/$COURSE_ID" -X POST `
  -H "Authorization: Bearer $TOKEN" `
  -H "Content-Type: application/json" `
  -d "{}"
```

Expected response:
```json
{
  "message": "Test notification sent successfully",
  "recipients": 1,
  "emails": ["student@example.com"]
}
```

### Step 7: Check Mailtrap Inbox
1. Go to https://mailtrap.io
2. Login to your account
3. Go to "Email Testing" → "Inbox"
4. You should see the test email with subject like `Test Reminder: "Your Course Name"`

---

## Check Logs in Backend Terminal

While running `npm run dev`, watch for:

**When scheduler runs (every minute):**
```
Email notifications sent for course 1 to 1 recipients.
```

**If SMTP fails:**
```
Error sending notification emails: ECONNREFUSED
```

**If no students enrolled:**
```
Notification (no SMTP): Class "Course Name" starts at ...
```

---

## Troubleshooting

### "SMTP not configured"
- Check `.env` has `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- Restart backend after adding env vars

### "No enrolled students"
- Make sure enrollment record exists in database
- Check: `SELECT * FROM Enrollments WHERE courseId = 1;`

### "Admin login failed"
- Seed database first: `node scripts/seedData.js` (if not already done)
- Check admin user: `SELECT * FROM Users WHERE email = 'admin@eduport.com';`

### "Email not appearing in Mailtrap"
- Check email wasn't caught by spam filter
- Check Mailtrap credentials are correct
- Test SMTP manually:
  ```javascript
  import nodemailer from 'nodemailer';
  
  const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'YOUR_USER',
      pass: 'YOUR_PASS'
    }
  });
  
  await transporter.sendMail({
    from: 'test@example.com',
    to: 'teststudent@eduport.com',
    subject: 'Test',
    text: 'This is a test'
  });
  
  console.log('Email sent!');
  ```

---

## What to Verify

✅ Backend starts without errors
✅ Scheduler logs "started - checking every minute"
✅ Test endpoint returns 200 and "sent successfully"
✅ Email appears in Mailtrap inbox within 1-2 seconds
✅ Email contains course name, start time, and student name

---

## Next Steps

Once email is working:
1. Test with actual course time (change scheduler to run every 10 seconds for testing)
2. Add email HTML templates (currently plain text)
3. Add retry logic for failed sends
4. Add rate limiting to prevent spam
5. Test with multiple enrolled students
