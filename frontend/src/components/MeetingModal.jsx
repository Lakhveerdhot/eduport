import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function MeetingModal({ onClose }){
  const { api } = useAuth();
  const navigate = useNavigate();
  const [showNewOptions, setShowNewOptions] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [error, setError] = useState(null);

  const createInstant = async () => {
    try {
      // create meeting on server
      const res = await api.post('/meetings');
      const { id } = res.data;
      onClose?.();
      navigate(`/meetings/${id}/instant`);
    } catch (err) {
      setError('Could not create meeting');
    }
  };

  const createForLater = async () => {
    // For now, create meeting and return id; scheduling to a calendar happens next
    try {
      const res = await api.post('/meetings');
      const { id } = res.data;
      onClose?.();
      navigate(`/meetings/${id}/instant?scheduled=1&when=${encodeURIComponent(scheduleDate)}`);
    } catch (err) {
      setError('Could not create scheduled meeting');
    }
  };

  // Google Calendar link helper (simple template)
  const googleCalendarUrl = (title, when) => {
    // when expected as ISO string; Google expects YYYYMMDDTHHMMSSZ for start/end - we'll set 1 hour default duration
    try {
      const start = new Date(when);
      const end = new Date(start.getTime() + 60*60*1000);
      const fmt = d => d.toISOString().replace(/[-:.]/g,'').split('.')[0] + 'Z';
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${fmt(start)}/${fmt(end)}`;
      return url;
    } catch (e) {
      return '#';
    }
  };

  const canSchedule = () => {
    if(!scheduleDate) return false;
    const p = new Date(scheduleDate);
    const now = Date.now();
    const max = now + 2*24*60*60*1000; // 2 days ahead
    return p.getTime() >= now && p.getTime() <= max;
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Meeting</h3>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>

        {!showNewOptions && (
          <div className="space-y-3">
            <button onClick={() => setShowNewOptions(true)} className="w-full bg-indigo-600 text-white py-2 rounded">New Meeting</button>
            <button onClick={() => { onClose?.(); navigate('/join-meeting'); }} className="w-full border py-2 rounded">Join Meeting</button>
          </div>
        )}

        {showNewOptions && (
          <div className="space-y-3">
            <button onClick={createForLater} disabled={!canSchedule()} className="w-full bg-gray-100 py-2 rounded">Create a meeting for later</button>
            <div>
              <label className="block text-sm">Schedule date (max 2 days ahead)</label>
              <input type="datetime-local" value={scheduleDate} onChange={e=>setScheduleDate(e.target.value)} className="w-full border p-2 rounded" />
              <div className="text-xs text-gray-500 mt-1">Choose a date/time within the next 2 days.</div>
              <a className="text-sm text-indigo-600" href={canSchedule() ? googleCalendarUrl('Eduport meeting', scheduleDate) : '#'} target="_blank" rel="noreferrer">Schedule Google Calendar</a>
            </div>
            <button onClick={createInstant} className="w-full bg-green-600 text-white py-2 rounded">Start an instant meeting</button>
            {error && <div className="text-red-600">{error}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
