import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const STREAMS = ['PCM','PCB','Commerce','PMS'];

export default function Signup(){
  const navigate = useNavigate();
  const { login, api } = useAuth();
  const { user } = useAuth();

  // If already logged in redirect away from signup
  React.useEffect(() => {
    if (user) {
      if (user.role === 'student') navigate('/student/dashboard');
      else if (user.role === 'teacher') navigate('/teacher/dashboard');
      else navigate('/admin/dashboard');
    }
  }, [user, navigate]);
  const [form, setForm] = useState({ fullName:'', email:'', password:'', confirmPassword:'', role:'student', stream:STREAMS[0] });
  const [error, setError] = useState(null);

  const handle = (k,v) => setForm(s=>({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirmPassword){ setError('Passwords do not match'); return }
    if (!form.password || form.password.length < 8) { setError('Password must be at least 8 characters'); return }
    try {
      const payload = { fullName: form.fullName, email: form.email, password: form.password, role: form.role };
      if (form.role === 'student') payload.stream = form.stream;
      const res = await api.post('/auth/signup', payload);
      const { token, user } = res.data;
      login({ token, user });
      if (user.role === 'student') navigate('/student/dashboard');
      else if (user.role === 'teacher') navigate('/teacher/dashboard');
      else navigate('/admin/dashboard');
    } catch (err) {
      const resp = err.response?.data;
      if (resp?.details && Array.isArray(resp.details)) {
        setError(resp.details.join('; '));
      } else {
        setError(resp?.message || 'Signup failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Sign Up</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={submit} className="grid grid-cols-1 gap-3">
          <input autoComplete="name" value={form.fullName} onChange={e=>handle('fullName', e.target.value)} placeholder="Full name" className="w-full border p-2 rounded" />
          <input autoComplete="email" value={form.email} onChange={e=>handle('email', e.target.value)} placeholder="Email" className="w-full border p-2 rounded" />
          <input autoComplete="new-password" value={form.password} onChange={e=>handle('password', e.target.value)} placeholder="Password" type="password" className="w-full border p-2 rounded" />
          <input autoComplete="new-password" value={form.confirmPassword} onChange={e=>handle('confirmPassword', e.target.value)} placeholder="Confirm password" type="password" className="w-full border p-2 rounded" />
          <div className="flex gap-4 items-center">
            <label className="text-sm">Role</label>
            <select value={form.role} onChange={e=>handle('role', e.target.value)} className="border p-2 rounded">
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
            {form.role === 'student' && (
              <select value={form.stream} onChange={e=>handle('stream', e.target.value)} className="border p-2 rounded">
                {STREAMS.map(s=> <option key={s} value={s}>{s}</option>)}
              </select>
            )}
          </div>
          <button className="w-full bg-blue-600 text-white py-2 rounded">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
