import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import Loading from '../components/Loading';
import CourseCard from '../components/CourseCard';
import Sidebar from '../components/Sidebar';

export default function CoursesList(){
  const { user, api } = useAuth();
  const [courses, setCourses] = useState(null);
  const [error, setError] = useState(null);

  useEffect(()=>{
    let mounted = true;
    setCourses(null);
    setError(null);

    const fetchForRole = async () => {
      try {
        if(!user){
          setError('Please login to view available courses.');
          setCourses([]);
          return;
        }

        if(user.role === 'student'){
          const res = await api.get('/student/courses');
          if(mounted) setCourses(res.data.courses || []);
        } else if(user.role === 'teacher'){
          const res = await api.get('/teacher/courses');
          if(mounted) setCourses(res.data.courses || []);
        } else if(user.role === 'admin'){
          // admins can see all courses — reuse teacher endpoint if available
          const res = await api.get('/teacher/courses');
          if(mounted) setCourses(res.data.courses || []);
        }
      } catch (err){
        console.error('Courses fetch error', err);
        if(mounted) setError('Failed to load courses');
      }
    }

    fetchForRole();
    return () => mounted = false;
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar links={[{to:'/', label:'Home'},{to:'/courses', label:'Courses'}]} />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold">Courses</h1>
          {!courses && <Loading />}
          {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

          {courses && courses.length === 0 && !error && (
            <div className="mt-4">No courses available.</div>
          )}

          {courses && courses.length > 0 && (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {courses.map(c => (
                <CourseCard key={c.id} course={c} enrolled={!!c.enrolled} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
