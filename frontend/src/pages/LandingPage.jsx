import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Landing page component: shows hero, features, steps, testimonials and footer
export default function LandingPage(){
  // Tracks which FAQ is open
  const [activeFAQ, setActiveFAQ] = useState(null);
  // Hero section visibility (trigger animations when in view)
  const heroRef = useRef(null);
  const [heroVisible, setHeroVisible] = useState(true);
  // Features section visibility (trigger animations when in view)
  const featuresRef = useRef(null);
  const [featuresVisible, setFeaturesVisible] = useState(false);

  // Static FAQ data used by the FAQ accordion
  const faqItems = [
    { q: 'What is Eduport?', a: 'Eduport is a comprehensive Learning Management System designed to facilitate online education, manage courses, track attendance, and send intelligent reminders to students.' },
    { q: 'How do I enroll in a course?', a: 'Sign up as a student, browse available courses, and click "Enroll" to join. You will receive notifications 15 minutes before each class.' },
    { q: 'Can teachers create courses?', a: 'Yes, teachers can create courses, manage students, schedule classes, and mark attendance using an intuitive dashboard.' },
    { q: 'Is there a mobile app?', a: 'You can access Eduport on any device via the web. A dedicated mobile app is coming soon.' },
    { q: 'How does attendance tracking work?', a: 'Teachers mark attendance during class, and students can view their attendance record in real-time from their dashboard.' },
  ];

  // Observe hero section and enable animations when it enters the viewport
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHeroVisible(true);
          } else {
            setHeroVisible(false);
          }
        });
      },
      { threshold: 0.2 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Observe features section and enable animations when it enters the viewport
  useEffect(() => {
    const el = featuresRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setFeaturesVisible(true);
          } else {
            setFeaturesVisible(false);
          }
        });
      },
      { threshold: 0.2 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Observe about section and enable animations when it enters the viewport
  const aboutRef = useRef(null);
  const [aboutVisible, setAboutVisible] = useState(false);

  useEffect(() => {
    const el = aboutRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAboutVisible(true);
          } else {
            setAboutVisible(false);
          }
        });
      },
      { threshold: 0.2 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section: main marketing message and image */}
      <header
  id="hero"
  className="relative bg-cover bg-center bg-no-repeat w-full min-h-[700px] flex items-center"
  ref={heroRef}
  style={{
    backgroundImage:
      'url("https://img.freepik.com/free-photo/high-angle-view-laptop-stationeries-blue-background_23-2147880456.jpg")'
  }}
>
  <div className="relative z-10 container-wide px-8 max-w-6xl mx-auto">
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div className={heroVisible ? 'animate-fadeUp' : 'opacity-0'}>
        <h1 className={`text-4xl md:text-5xl font-bold text-indigo-700 ${heroVisible ? 'animate-fadeUp' : 'opacity-0'}`}>
          Eduport — Learning Made Simple
        </h1>

        <p className={`mt-4 text-lg text-gray-700 ${heroVisible ? 'animate-fadeDelay' : 'opacity-0'}`}>
          Secure, reliable online classes with attendance tracking, reminders
          and course management.
        </p>

        <div className={`mt-6 text-sm text-gray-600 ${heroVisible ? 'animate-fadeDelay2' : 'opacity-0'}`}>
          Join thousands of learners — works on desktop and mobile.
        </div>
      </div>
    </div>
  </div>
</header>



      {/* Features Section: grid of product features */}
      <section
  id="features"
  className="py-12 bg-blue-50"
  ref={featuresRef}
>
  <div className="container-wide px-6 max-w-6xl mx-auto">

    {/* Section Title */}
    <h2
      className={`text-3xl font-semibold text-center mb-4 ${featuresVisible ? 'animate-fadeDown' : 'opacity-0'}`}
      style={featuresVisible ? { animationDelay: '0ms' } : {}}
    >
      Features
    </h2>

    {/* Short Description */}
    <p
      className={`text-center text-gray-600 mb-10 ${featuresVisible ? 'animate-fadeUp' : 'opacity-0'}`}
      style={featuresVisible ? { animationDelay: '80ms' } : {}}
    >
      All the tools you need to run modern online classes.
    </p>

    {/* Grid */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { img: 'https://www.globusinfocom.com/media/wysiwyg/live-classes-vc.jpg', title: 'Live Classes', desc: 'High-quality live sessions with chat and interaction.' },
        { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvD7s0tSd2KjP04cI7-pHQ9g2yqPPWhzmqDQ&s', title: 'Attendance', desc: 'Quick attendance marking and exportable reports.' },
        { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTv8LEv_-KqtD2tbM-18oq7jqE4qUlhCuxVA&s', title: 'Reminders', desc: 'Smart notifications before class starts.' },
        { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQloguR9jpCqHJHPo0SFRwwFyWBJ-h31GVC0w&s', title: 'Course Library', desc: 'Organize recordings and resources per course.' },
        { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFrlG8nIP-1ENSMygdP7nUNixDF-THgrWplg&s', title: 'Role Management', desc: 'Student, teacher, and admin roles with permissions.' },
        { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXaJbmZXffpXVHAmv2D0XiEXSP5L9nsc55Ag&s', title: 'Secure', desc: 'Secure authentication and protected class links.' },
        ].map((f, i) => (
        <div
          key={i}
          className={`border rounded-xl p-6 bg-white hover:shadow-lg transition transform hover:-translate-y-1 ${featuresVisible ? 'animate-fadeIn' : 'opacity-0'}`}
          style={featuresVisible ? { animationDelay: `${i * 0.15}s` } : {}}
        >

          {/* Feature Image */}
            <img
              src={f.img}
              alt={f.title}
              className="feature-img-responsive mb-4 rounded-md"
            />

          {/* Title */}
          <h3 className="font-semibold mb-2">{f.title}</h3>

          {/* Description */}
          <p className="text-sm text-gray-600">{f.desc}</p>
        </div>
      ))}
    </div>

  </div>
</section>

      {/* About Section: platform description and stats */}
      <section id="about" className="py-14 bg-white" ref={aboutRef}>
        <div className="container-wide px-6 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Illustration */}
            <div className={aboutVisible ? 'animate-fadeUp' : 'opacity-0'} style={aboutVisible ? { animationDelay: '80ms' } : {}}>
              <img src="https://appinventiv.com/wp-content/uploads/2020/12/LMS-Features-Supporting-Distance-Learning.png" alt="About Us" className="rounded-lg" />
            </div>
            <div className={aboutVisible ? 'animate-fadeDelay' : 'opacity-0'} style={aboutVisible ? { animationDelay: '200ms' } : {}}>
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
                <div className={aboutVisible ? 'animate-fadeDelay2' : 'opacity-0'} style={aboutVisible ? { animationDelay: '360ms' } : {}}>
                  <div className="text-2xl font-bold text-indigo-700">10K+</div>
                  <p className="text-gray-600 text-sm">Active Users</p>
                </div>
                <div className={aboutVisible ? 'animate-fadeDelay2' : 'opacity-0'} style={aboutVisible ? { animationDelay: '420ms' } : {}}>
                  <div className="text-2xl font-bold text-indigo-700">500+</div>
                  <p className="text-gray-600 text-sm">Courses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section: simple 4-step onboarding */}
      <section className="py-16 bg-blue-50">
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
              <div key={i} className="border rounded-md p-6 text-center transition-colors duration-300 hover:bg-[#2d8cff] hover:text-white hover:shadow-lg cursor-pointer">
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
            <div className="p-8 rounded-lg border bg-gradient-to-r from-white to-blue-200 shadow-md">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80&auto=format&fit=crop" alt="Students" className="w-20 h-20 rounded-full mb-4 object-cover" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">For Students</h3>
              {/* Student benefits list */}
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-green-500 text-white rounded-full mr-3 flex-shrink-0">✓</span>
                  <span>Enroll in courses matching your stream</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-green-500 text-white rounded-full mr-3 flex-shrink-0">✓</span>
                  <span>Join live classes from anywhere</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-green-500 text-white rounded-full mr-3 flex-shrink-0">✓</span>
                  <span>Get reminders before each class</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-green-500 text-white rounded-full mr-3 flex-shrink-0">✓</span>
                  <span>Track your attendance and progress</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-green-500 text-white rounded-full mr-3 flex-shrink-0">✓</span>
                  <span>Access course materials anytime</span>
                </li>
              </ul>
            </div>
            {/* Teacher features */}
            <div className="p-8 rounded-lg border bg-gradient-to-l from-white to-blue-200 shadow-md">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80&auto=format&fit=crop" alt="Teachers" className="w-20 h-20 rounded-full mb-4 object-cover" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">For Teachers</h3>
              {/* Teacher benefits list */}
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-green-500 text-white rounded-full mr-3 flex-shrink-0">✓</span>
                  <span>Create and manage multiple courses</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-green-500 text-white rounded-full mr-3 flex-shrink-0">✓</span>
                  <span>Schedule live classes easily</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-green-500 text-white rounded-full mr-3 flex-shrink-0">✓</span>
                  <span>Mark attendance in real-time</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-green-500 text-white rounded-full mr-3 flex-shrink-0">✓</span>
                  <span>Monitor student engagement</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-green-500 text-white rounded-full mr-3 flex-shrink-0">✓</span>
                  <span>Generate detailed reports</span>
                </li>
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
              <div key={i} className="border border-blue-200 rounded-lg overflow-hidden">
                <button
                  // Toggles FAQ open/close
                  onClick={() => setActiveFAQ(activeFAQ === i ? null : i)}
                  className="w-full px-6 py-4 bg-blue-50 hover:bg-blue-100 text-left font-semibold text-gray-800 flex items-center justify-between transition"
                >
                  {item.q}
                  <span className="text-2xl text-blue-600 font-bold">{activeFAQ === i ? '−' : '+'}</span>
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
