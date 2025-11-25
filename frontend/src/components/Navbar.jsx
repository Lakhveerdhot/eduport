import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import MeetingModal from './MeetingModal';

export default function Navbar(){
  const { user, logout } = useAuth();
  const [showMeeting, setShowMeeting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

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
          {!user && <Link to="/login" className="hidden lg:inline-block text-sm text-indigo-700 hover:underline">Sign In</Link>}
          {!user && <Link to="/signup" className="hidden md:inline-block bg-indigo-600 text-white px-4 py-2 rounded-md text-sm">Sign Up</Link>}
          {user && (
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-700">{user.fullName}</div>
              <button onClick={logout} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm">Logout</button>
            </div>
          )}
          {/* Mobile menu button */}
          <button onClick={toggleMobileMenu} className="lg:hidden text-gray-700 hover:text-indigo-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t px-6 py-4">
          <nav className="flex flex-col gap-4 text-sm text-gray-700">
            <Link to="/" className="hover:text-indigo-800" onClick={toggleMobileMenu}>Home</Link>
            {user && <Link to="/courses" className="hover:text-indigo-800" onClick={toggleMobileMenu}>Courses</Link>}
            <a href="#features" className="hover:text-indigo-800" onClick={toggleMobileMenu}>Features</a>
            <a href="#about" className="hover:text-indigo-800" onClick={toggleMobileMenu}>About</a>
            <a href="#faq" className="hover:text-indigo-800" onClick={toggleMobileMenu}>FAQ</a>

            {!user && (
              <div className="flex flex-col gap-2 mt-4">
                <Link to="/login" className="text-indigo-700 bg-indigo-50 px-3 py-2 rounded-md text-center hover:bg-indigo-100" onClick={toggleMobileMenu}>Sign In</Link>
                <Link to="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-center" onClick={toggleMobileMenu}>Sign Up</Link>
              </div>
            )}
          </nav>
        </div>
      )}
      {showMeeting && <MeetingModal onClose={() => setShowMeeting(false)} />}
    </header>
  );
}
