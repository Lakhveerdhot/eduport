# LMS Backend Development TODO

## 1. Project Initialization
- [ ] Initialize npm project in backend/ folder
- [ ] Install all required dependencies (express, sequelize, mysql2, jsonwebtoken, bcryptjs, dotenv, joi, helmet, express-rate-limit, node-cron, jest, supertest, nodemon, sequelize-cli)
- [ ] Set "type": "module" in package.json for ES modules

## 2. Environment and Configuration
- [ ] Create .env file with required variables (PORT, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, JWT_EXPIRES_IN)
- [ ] Create config/database.js for Sequelize connection
- [ ] Create config/env.js for environment variable validation

## 3. Database Models and Migrations
- [ ] Create Sequelize models: User, Course, Enrollment, Attendance, NotificationLog
- [ ] Set up relationships between models
- [ ] Generate and run migrations for all models

## 4. Controllers
- [ ] Create authController.js (signup, login, me)
- [ ] Create adminController.js (CRUD for users)
- [ ] Create teacherController.js (course CRUD, attendance marking)
- [ ] Create studentController.js (view courses, enroll, view attendance)
- [ ] Create generalController.js (list courses, get course details)

## 5. Middlewares
- [ ] Create verifyToken middleware for JWT authentication
- [ ] Create requireRole middleware for authorization
- [ ] Create validation middlewares using Joi for request bodies
- [ ] Create security middlewares (helmet, rate-limit)

## 6. Routes
- [ ] Create authRoutes.js
- [ ] Create adminRoutes.js
- [ ] Create teacherRoutes.js
- [ ] Create studentRoutes.js
- [ ] Create generalRoutes.js

## 7. Services and Utils
- [ ] Create notificationService.js using node-cron for class reminders
- [ ] Create utils/helpers.js for common functions

## 8. Application Setup
- [ ] Create app.js with Express setup, middlewares, routes
- [ ] Create server.js to start the server
- [ ] Add error handling middleware

## 9. Tests
- [ ] Set up Jest configuration
- [ ] Create tests for auth routes (signup, login)
- [ ] Create tests for student routes (get courses)
- [ ] Create tests for teacher routes (create course)

## 10. Final Setup
- [ ] Update package.json scripts (dev, start, test)
- [ ] Run migrations
- [ ] Run tests to verify
- [ ] Start server with npm run dev
