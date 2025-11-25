import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import Sidebar from '../../components/Sidebar';
import Loading from '../../components/Loading';

export default function TeacherDashboard(){
  const { user, api } = useAuth();
  const [courses, setCourses] = useState(null);

  useEffect(()=>{
    let mounted = true;
    api.get('/teacher/courses').then(r=>{ if(mounted) setCourses(r.data.courses) }).catch(()=>{ if(mounted) setCourses([]) });
    return ()=> mounted = false;
  },[]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar links={[{to:'/teacher/dashboard', label:'Courses'}]} />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
          <div className="mt-4">
            <a href="#create" className="bg-green-600 text-white px-3 py-2 rounded">Create New Course</a>
          </div>

          <section className="mt-6">
            <h2 className="text-xl">My Courses</h2>
            {!courses && <Loading />}
            {courses && courses.length === 0 && <div className="mt-4">No courses yet.</div>}
            {courses && courses.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                {courses.map(c => (
                  <div key={c.id} className="bg-white p-4 rounded shadow">
                    <div className="font-semibold">{c.title}</div>
                    <div className="text-sm">{c.subject} — {c.stream}</div>
                    <div className="mt-2 flex gap-2">
                      <button className="px-2 py-1 bg-yellow-400 rounded">Edit</button>
                      <button className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                      <button className="px-2 py-1 bg-blue-600 text-white rounded">Mark Attendance</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
