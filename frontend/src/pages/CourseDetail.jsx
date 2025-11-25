import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api from '../api/axios';
import Loading from '../components/Loading';

export default function CourseDetail(){
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(()=>{
    let mounted = true;
    api.get(`/courses/${id}`).then(r=>{ if(mounted) setCourse(r.data.course) }).catch(err=> setMessage('Could not load course')).finally(()=> setLoading(false));
    return ()=> mounted = false;
  },[id]);

  const enroll = async () => {
    try {
      await api.post(`/student/courses/${id}/enroll`);
      setMessage('Enrolled successfully');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Enroll failed');
    }
  };

  if (loading) return <Loading />;
  if (!course) return <div className="p-6">Course not found</div>;

  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded shadow max-w-3xl">
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <div className="text-sm text-gray-600 mt-2">{course.subject} — {course.stream}</div>
        <div className="mt-4 text-gray-700">{course.description}</div>
        <div className="mt-4 text-sm text-gray-500">Teacher: {course.teacher?.fullName}</div>
        <div className="mt-2 text-sm text-gray-500">Start: {new Date(course.startTime).toLocaleString()}</div>
        <div className="mt-2 text-sm text-gray-500">End: {new Date(course.endTime).toLocaleString()}</div>

        {user && user.role === 'student' && (
          <div className="mt-6">
            <button onClick={enroll} className="bg-blue-600 text-white px-4 py-2 rounded">Enroll</button>
          </div>
        )}

        {message && <div className="mt-4 text-sm text-green-600">{message}</div>}
      </div>
    </div>
  );
}
