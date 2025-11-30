# 🚀 EduPort Deployment Guide

## Overview
This guide will help you deploy your EduPort LMS application to production using:
- **Backend**: Render (Node.js)
- **Frontend**: Vercel (React)
- **Database**: Railway (MySQL)

---

## 📋 Prerequisites

### Accounts You Need:
1. **GitHub Account** - For code repository
2. **Render Account** - For backend deployment
3. **Vercel Account** - For frontend deployment
4. **Railway Account** - For database (already set up)

### Before Starting:
- ✅ Code is pushed to GitHub
- ✅ Railway MySQL database is created
- ✅ You have Railway DATABASE_URL

---

## 🔧 Step 1: Prepare Your Code

### 1.1 Push Code to GitHub
```bash
# Make sure your code is committed and pushed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 1.2 Note Your Railway Database URL
- Go to Railway dashboard
- Find your MySQL database
- Copy the `DATABASE_URL` (looks like: `mysql://user:pass@host:port/db`)

---

## 🌐 Step 2: Deploy Backend on Render

### 2.1 Create Render Account
1. Go to [https://render.com](https://render.com)
2. Click "Get Started" → "Sign Up"
3. Verify your email

### 2.2 Connect GitHub Repository
1. Click "New" (top right)
2. Select "Web Service"
3. Click "Connect" under GitHub
4. Authorize Render to access your GitHub
5. Search and select your repository

### 2.3 Configure Backend Service
Fill in the details:
```
Name: eduport-backend
Runtime: Node
Root Directory: backend
Build Command: npm install && npm run migrate
Start Command: npm start
```

### 2.4 Set Environment Variables
In the "Environment" section, add these variables:

**Required:**
```
NODE_ENV=production
DATABASE_URL=mysql://your-railway-db-url-here
JWT_SECRET=your-super-secure-random-string-here
```

**Optional (for email notifications):**
```
EMAIL_FROM=your-email@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 2.5 Deploy Backend
1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. **Copy the backend URL** (e.g., `https://eduport-backend.onrender.com`)
4. Test: Visit `https://your-backend-url.onrender.com/api/courses`

---

## 🎨 Step 3: Deploy Frontend on Vercel

### 3.1 Create Vercel Account
1. Go to [https://vercel.com](https://vercel.com)
2. Click "Sign Up" → Use GitHub to sign up
3. Authorize Vercel

### 3.2 Import Project
1. Click "New Project" (top right)
2. Import your GitHub repository
3. Configure project settings:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```

### 3.3 Set Environment Variables
In Project Settings → Environment Variables, add:
```
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

### 3.4 Deploy Frontend
1. Click "Deploy"
2. Wait 2-3 minutes
3. **Copy the frontend URL** (e.g., `https://eduport.vercel.app`)

---

## 🗄️ Step 4: Seed Database (Optional)

If you want dummy data in production:

### Option 1: Run Seed Script Manually
1. Go to Render dashboard → Your backend service
2. Click "Shell" tab
3. Run: `npm run seed`

### Option 2: Add to Build Process
Modify `render.yaml` build command to include seeding:
```
Build Command: npm install && npm run migrate && npm run seed
```

---

## ✅ Step 5: Test Your Deployment

### 5.1 Test Backend API
Visit these URLs in browser:
- `https://your-backend-url.onrender.com/api/courses`
- Should return course list

### 5.2 Test Frontend
1. Visit your Vercel URL
2. Try to register/login
3. Check if API calls work

### 5.3 Test Login Credentials
Use credentials from `backend/CREDENTIALS.txt`:
- Admin: `admin@eduport.com` / `AdminPass123`
- Teachers: `alice@eduport.com` / `TeacherPass123`
- Students: `student1@eduport.com` / `StudentPass123`

---

## 🔧 Troubleshooting

### Backend Issues:
- **Build fails**: Check Render logs, ensure all dependencies are in package.json
- **Database connection**: Verify DATABASE_URL format
- **Port issues**: Backend automatically uses Render's PORT

### Frontend Issues:
- **API not working**: Check VITE_API_BASE_URL matches backend URL
- **Build fails**: Ensure Vite config is correct
- **CORS errors**: Backend has CORS enabled by default

### Database Issues:
- **Migration fails**: Check Railway database is accessible
- **Seed fails**: Database might be timing out, try smaller batches

---

## 📝 Important Notes

1. **Free Tiers**:
   - Render: 750 hours/month free
   - Vercel: Unlimited free for personal
   - Railway: Limited free resources

2. **Custom Domains**:
   - Both Render and Vercel support custom domains
   - Buy domain from Namecheap/GoDaddy, connect in dashboard

3. **Environment Variables**:
   - Never commit secrets to GitHub
   - Use different JWT_SECRET for production
   - Keep DATABASE_URL private

4. **Monitoring**:
   - Check Render/Vercel logs for errors
   - Monitor Railway database usage

---

## 🎉 You're Done!

Your EduPort LMS is now live! Share the Vercel URL with your clients.

**Frontend URL**: `https://your-project.vercel.app`
**Backend API**: `https://your-backend.onrender.com`

Need help? Check the logs in Render/Vercel dashboards or ask for support!

---

## 📞 Support

If you face any issues:
1. Check deployment logs
2. Verify environment variables
3. Test database connection
4. Contact platform support (Render/Vercel)

Happy deploying! 🚀
