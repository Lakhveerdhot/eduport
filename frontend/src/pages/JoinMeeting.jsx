import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function JoinMeeting(){
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { api } = useAuth();

  const join = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Check meeting exists
      await api.get(`/meetings/${code}/offer`);
      navigate(`/meetings/${code}/instant?join=1`);
    } catch (err) {
      setError('Meeting not found or invalid code');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Join Meeting</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={join} className="space-y-3">
          <input value={code} onChange={e=>setCode(e.target.value)} placeholder="Meeting code" className="w-full border p-2 rounded" />
          <button className="w-full bg-blue-600 text-white py-2 rounded">Join</button>
        </form>
      </div>
    </div>
  );
}
