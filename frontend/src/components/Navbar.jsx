import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import MeetingModal from './MeetingModal';

export default function Navbar(){
  const { user, logout } = useAuth();
  const [showMeeting, setShowMeeting] = useState(false);
  const navigate = useNavigate();
  return (
    <header className="bg-white border-b">
      <div className="container-wide mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-2xl font-extrabold text-indigo-700">Eduport</Link>
          <nav className="hidden lg:flex items-center gap-6 text-sm text-gray-700">
            <Link to="/" className="hover:text-indigo-800">Home</Link>
            {user && <Link to="/courses" className="hover:text-indigo-800">Courses</Link>}
            <a href="#features" className="hover:text-indigo-800">Features</a>
            <a href="#about" className="hover:text-indigo-800">About</a>
            <a href="#faq" className="hover:text-indigo-800">FAQ</a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Meeting button: behavior varies by role */}
          {!user && (
            <Link to="/signup" className="hidden sm:inline-block text-sm px-3 py-2 rounded-md text-indigo-700 hover:bg-indigo-50">Host a Meeting</Link>
          )}
          {user && user.role === 'teacher' && (
            <button onClick={() => setShowMeeting(true)} className="hidden sm:inline-block text-sm px-3 py-2 rounded-md text-indigo-700 hover:bg-indigo-50">Host a Meeting</button>
          )}
          {user && user.role === 'student' && (
            <button onClick={() => navigate('/join-meeting')} className="hidden sm:inline-block text-sm px-3 py-2 rounded-md text-indigo-700 hover:bg-indigo-50">Join Meeting</button>
          )}
          {!user && <Link to="/login" className="text-sm text-indigo-700 hover:underline">Sign In</Link>}
          {!user && <Link to="/signup" className="hidden md:inline-block bg-indigo-600 text-white px-4 py-2 rounded-md text-sm">Sign Up</Link>}
          {user && (
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-700">{user.fullName}</div>
              <button onClick={logout} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm">Logout</button>
            </div>
          )}
        </div>
      </div>
      {showMeeting && <MeetingModal onClose={() => setShowMeeting(false)} />}
    </header>
  );
}
