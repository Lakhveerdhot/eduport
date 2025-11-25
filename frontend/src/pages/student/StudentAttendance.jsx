import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import Sidebar from '../../components/Sidebar';
import Loading from '../../components/Loading';

export default function StudentAttendance(){
  const { user, api } = useAuth();
  const [att, setAtt] = useState(null);

  useEffect(()=>{
    let mounted = true;
    api.get('/student/attendance').then(r=>{ if(mounted) setAtt(r.data.attendances) }).catch(()=>{ if(mounted) setAtt([]) });
    return ()=> mounted = false;
  },[]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar links={[{to:'/student/dashboard', label:'My Courses'},{to:'/student/attendance', label:'Attendance'}]} />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold">Attendance</h1>
          {!att && <Loading />}
          {att && att.length === 0 && <div className="mt-4">No attendance records.</div>}
          {att && att.length > 0 && (
            <table className="mt-4 w-full bg-white">
              <thead><tr><th className="p-2">Date</th><th className="p-2">Course</th><th className="p-2">Status</th></tr></thead>
              <tbody>
                {att.map(a => (
                  <tr key={a.id} className="border-t"><td className="p-2">{a.date}</td><td className="p-2">{a.Course?.title}</td><td className="p-2">{a.status}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </main>
      </div>
    </div>
  );
}
