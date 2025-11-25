import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import Sidebar from '../../components/Sidebar';
import Loading from '../../components/Loading';
import CourseCard from '../../components/CourseCard';

export default function StudentDashboard(){
  const { user, api } = useAuth();
  const [courses, setCourses] = useState(null);

  useEffect(()=>{
    let mounted = true;
    api.get('/student/courses').then(r=>{ if(mounted) setCourses(r.data.courses) }).catch(()=>{ if(mounted) setCourses([]) });
    return ()=> mounted = false;
  },[]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar links={[{to:'/student/dashboard', label:'My Courses'},{to:'/student/attendance', label:'Attendance'}]} />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold">Welcome, {user?.fullName}</h1>
          <section className="mt-6">
            <h2 className="text-xl">My Courses</h2>
            {!courses && <Loading />}
            {courses && courses.length === 0 && <div className="mt-4">No courses found.</div>}
            {courses && courses.length > 0 && (
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {courses.map(c => (
                  <CourseCard key={c.id} course={c} enrolled={!!c.enrolled} />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
