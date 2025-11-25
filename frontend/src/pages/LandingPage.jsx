import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Landing page component: shows hero, features, steps, testimonials and footer
export default function LandingPage(){
  // Tracks which FAQ is open
  const [activeFAQ, setActiveFAQ] = useState(null);

  // Static FAQ data used by the FAQ accordion
  const faqItems = [
    { q: 'What is Eduport?', a: 'Eduport is a comprehensive Learning Management System designed to facilitate online education, manage courses, track attendance, and send intelligent reminders to students.' },
    { q: 'How do I enroll in a course?', a: 'Sign up as a student, browse available courses, and click "Enroll" to join. You will receive notifications 15 minutes before each class.' },
    { q: 'Can teachers create courses?', a: 'Yes, teachers can create courses, manage students, schedule classes, and mark attendance using an intuitive dashboard.' },
    { q: 'Is there a mobile app?', a: 'You can access Eduport on any device via the web. A dedicated mobile app is coming soon.' },
    { q: 'How does attendance tracking work?', a: 'Teachers mark attendance during class, and students can view their attendance record in real-time from their dashboard.' },
  ];

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section: main marketing message and image */}
      <header className="bg-white py-10">
        <div className="container-wide px-6 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              {/* Headline */}
              <h1 className="text-4xl md:text-5xl font-bold text-indigo-700">Eduport — Learning Made Simple</h1>
              {/* Subheading */}
              <p className="mt-4 text-lg text-gray-600">Secure, reliable online classes with attendance tracking, reminders and course management.</p>
              {/* CTAs (commented out until auth is wired) */}
              <div className="mt-6 flex flex-wrap gap-3">
                {/* Signup/login links go here after auth is set up */}
              </div>
              {/* Small trust note */}
              <div className="mt-6 text-sm text-gray-500">Join thousands of learners — works on desktop and mobile.</div>
            </div>
            <div className="flex justify-center md:justify-end">
              {/* Dashboard preview image */}
              <div className="w-full max-w-md border rounded-md overflow-hidden">
                <img src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=900&q=80&auto=format&fit=crop" alt="Dashboard preview" className="w-full h-auto object-cover" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section: grid of product features */}
      <section id="features" className="py-12 bg-white">
        <div className="container-wide px-6 max-w-6xl mx-auto">
          {/* Section title */}
          <h2 className="text-3xl font-semibold text-center mb-6">Features</h2>
          {/* Short description */}
          <p className="text-center text-gray-600 mb-10">All the tools you need to run modern online classes.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Map of feature cards */}
            {[
              { icon: '🎥', title: 'Live Classes', desc: 'High-quality live sessions with chat and interaction.' },
              { icon: '📊', title: 'Attendance', desc: 'Quick attendance marking and exportable reports.' },
              { icon: '🔔', title: 'Reminders', desc: 'Smart notifications before class starts.' },
              { icon: '📚', title: 'Course Library', desc: 'Organize recordings and resources per course.' },
              { icon: '👥', title: 'Role Management', desc: 'Student, teacher, and admin roles with permissions.' },
              { icon: '🔒', title: 'Secure', desc: 'Secure authentication and protected class links.' },
            ].map((f, i) => (
              <div key={i} className="border rounded-md p-6 hover:shadow-sm transition">
                {/* Feature icon */}
                <div className="text-3xl mb-3">{f.icon}</div>
                {/* Feature title */}
                <h3 className="font-semibold mb-2">{f.title}</h3>
                {/* Feature description */}
                <p className="text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section: platform description and stats */}
      <section id="about" className="py-14 bg-white">
        <div className="container-wide px-6 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Illustration */}
            <div>
              <img src="https://images.unsplash.com/photo-1522881451255-f59ad836fdfb?w=900&q=80&auto=format&fit=crop" alt="About Us" className="rounded-lg" />
            </div>
            <div>
              {/* About heading */}
              <h2 className="text-3xl font-bold mb-4">About Eduport</h2>
              {/* Description paragraphs */}
              <p className="text-gray-700 text-base leading-relaxed mb-3">
                Eduport is a lightweight Learning Management System built to make online classes easy and reliable. It brings students and teachers together in a single digital space.
              </p>
              <p className="text-gray-700 text-base leading-relaxed mb-3">
                Built with pragmatic features — live sessions, attendance, reminders and course materials — Eduport keeps the learning experience focused and efficient.
              </p>
              {/* Quick stats */}
              <div className="mt-6 flex gap-8">
                <div>
                  <div className="text-2xl font-bold text-indigo-700">10K+</div>
                  <p className="text-gray-600 text-sm">Active Users</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-700">500+</div>
                  <p className="text-gray-600 text-sm">Courses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section: simple 4-step onboarding */}
      <section className="py-16 bg-white">
        <div className="container-wide px-6 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">Simple steps to get started</p>
          <div className="grid md:grid-cols-4 gap-6">
            {/* Onboarding steps */}
            {[
              { num: '1', title: 'Sign Up', desc: 'Create your account as a student, teacher, or admin.' },
              { num: '2', title: 'Explore Courses', desc: 'Browse and discover courses tailored to your stream.' },
              { num: '3', title: 'Enroll & Attend', desc: 'Join courses and attend live classes on schedule.' },
              { num: '4', title: 'Track Progress', desc: 'Monitor attendance and performance in real-time.' },
            ].map((step, i) => (
              <div key={i} className="border rounded-md p-6 text-center">
                {/* Step number badge */}
                <div className="w-12 h-12 bg-[#2d8cff] text-white rounded-full flex items-center justify-center text-lg font-semibold mx-auto mb-3">{step.num}</div>
                {/* Step title */}
                <h3 className="text-md font-semibold text-gray-800">{step.title}</h3>
                {/* Step description */}
                <p className="mt-2 text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audience Section: features for students and teachers */}
      <section className="py-16 bg-white">
        <div className="container-wide px-6 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Tailored For Everyone</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Student features */}
            <div className="p-8 rounded-lg border">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80&auto=format&fit=crop" alt="Students" className="w-20 h-20 rounded-full mb-4 object-cover" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">For Students</h3>
              {/* Student benefits list */}
              <ul className="space-y-3 text-gray-700">
                <li>✓ Enroll in courses matching your stream</li>
                <li>✓ Join live classes from anywhere</li>
                <li>✓ Get reminders before each class</li>
                <li>✓ Track your attendance and progress</li>
                <li>✓ Access course materials anytime</li>
              </ul>
            </div>
            {/* Teacher features */}
            <div className="p-8 rounded-lg border">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80&auto=format&fit=crop" alt="Teachers" className="w-20 h-20 rounded-full mb-4 object-cover" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">For Teachers</h3>
              {/* Teacher benefits list */}
              <ul className="space-y-3 text-gray-700">
                <li>✓ Create and manage multiple courses</li>
                <li>✓ Schedule live classes easily</li>
                <li>✓ Mark attendance in real-time</li>
                <li>✓ Monitor student engagement</li>
                <li>✓ Generate detailed reports</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section: user quotes */}
      <section className="py-16 bg-gray-50">
        <div className="container-wide px-6 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Simple testimonial cards map */}
            {[
              { name: 'Priya Sharma', role: 'Student', text: 'Eduport helped me never miss a class! The reminders are super useful and the attendance tracking is transparent.' },
              { name: 'Rajesh Kumar', role: 'Teacher', text: 'Managing my courses is so easy now. I can focus on teaching instead of worrying about attendance records.' },
              { name: 'Arjun Patel', role: 'Admin', text: 'The platform is reliable, intuitive, and has reduced our administrative burden significantly.' },
            ].map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                {/* Avatar and name */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full text-white flex items-center justify-center font-bold">{t.name.charAt(0)}</div>
                  <div>
                    <div className="font-semibold text-gray-800">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role}</div>
                  </div>
                </div>
                {/* Quote */}
                <p className="text-gray-700">"{t.text}"</p>
                {/* Star rating (visual only) */}
                <div className="mt-4 flex gap-1">{'⭐⭐⭐⭐⭐'.split('').map((s, i) => <span key={i}>{s}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section: accordion of common questions */}
      <section className="py-16 bg-white">
        <div className="container-wide px-6 max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {/* FAQ accordion map */}
            {faqItems.map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  // Toggles FAQ open/close
                  onClick={() => setActiveFAQ(activeFAQ === i ? null : i)}
                  className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 text-left font-semibold text-gray-800 flex items-center justify-between transition"
                >
                  {item.q}
                  <span className="text-indigo-600">{activeFAQ === i ? '−' : '+'}</span>
                </button>
                {/* Answer panel (visible when active) */}
                {activeFAQ === i && (
                  <div className="px-6 py-4 bg-white text-gray-700 border-t border-gray-200">{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Footer: links and legal */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container-wide px-6 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">Eduport</h4>
              <p className="text-sm">Modern Learning Management System for the digital age.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">About</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-white transition">Feedback</a></li>
              </ul>
            </div>
          </div>
          {/* Footer bottom: copyright and social */}
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© 2025 Eduport. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0 text-sm">
              <a href="#" className="hover:text-white transition">Facebook</a>
              <a href="#" className="hover:text-white transition">Twitter</a>
              <a href="#" className="hover:text-white transition">LinkedIn</a>
              <a href="#" className="hover:text-white transition">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
