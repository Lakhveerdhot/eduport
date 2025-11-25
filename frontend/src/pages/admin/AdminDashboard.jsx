import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';

export default function AdminDashboard(){
  const { api } = useAuth();
  const [summary, setSummary] = useState(null);

  useEffect(()=>{
    let mounted = true;
    // crude summary: fetch counts
    Promise.all([
      api.get('/admin/users').catch(()=>({ data: { users: [] } })),
      api.get('/courses').catch(()=>({ data: { courses: [] } })),
    ]).then(([u,c])=>{
      if(!mounted) return;
      setSummary({ users: u.data.users || [], courses: c.data.courses || [] });
    });
    return ()=> mounted = false;
  },[]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      {!summary && <div className="mt-4">Loading...</div>}
      {summary && (
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-4 rounded shadow">Total users: {summary.users.length}</div>
          <div className="bg-white p-4 rounded shadow">Total courses: {summary.courses.length}</div>
          <div className="bg-white p-4 rounded shadow">(Attendance stats coming)</div>
        </div>
      )}
    </div>
  );
}
