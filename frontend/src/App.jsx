import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import JoinMeeting from './pages/JoinMeeting';
import InstantMeeting from './pages/meeting/InstantMeeting';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentAttendance from './pages/student/StudentAttendance';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import CourseDetail from './pages/CourseDetail';
import CoursesList from './pages/CoursesList';

export default function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/student/dashboard" element={<ProtectedRoute roles={["student"]}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/attendance" element={<ProtectedRoute roles={["student"]}><StudentAttendance /></ProtectedRoute>} />

          <Route path="/teacher/dashboard" element={<ProtectedRoute roles={["teacher"]}><TeacherDashboard /></ProtectedRoute>} />

          <Route path="/admin/dashboard" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/courses" element={<CoursesList />} />
          <Route path="/courses/:id" element={<ProtectedRoute roles={["student","teacher","admin"]}><CourseDetail /></ProtectedRoute>} />
          <Route path="/join-meeting" element={<JoinMeeting />} />
          <Route path="/meetings/:id/instant" element={<InstantMeeting />} />

          <Route path="*" element={<div className="p-6">Page not found</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
