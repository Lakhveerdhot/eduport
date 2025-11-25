import React, { useEffect, useRef, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const POLL_INTERVAL = 2000;

export default function InstantMeeting(){
  const { id } = useParams();
  const loc = useLocation();
  const search = new URLSearchParams(loc.search);
  const joinMode = search.get('join') === '1' || search.get('join') === 'true';
  const { api } = useAuth();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const [status, setStatus] = useState('connecting');
  const [meetingCode] = useState(id);
  const navigate = useNavigate();

  useEffect(()=>{
    let mounted = true;
    let pollCandidatesInterval = null;

    const startHost = async () => {
      try {
        const pc = new RTCPeerConnection();
        pcRef.current = pc;

        localStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        localVideoRef.current.srcObject = localStreamRef.current;

        localStreamRef.current.getTracks().forEach(t=>pc.addTrack(t, localStreamRef.current));

        pc.ontrack = (ev) => {
          remoteVideoRef.current.srcObject = ev.streams[0];
        };

        pc.onicecandidate = (e) => {
          if (e.candidate) {
            // send candidate to server as host
            api.post(`/meetings/${id}/candidate`, { candidate: e.candidate, role: 'host' }).catch(()=>{});
          }
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        // post offer
        await api.post(`/meetings/${id}/offer`, { offer });

        // poll for answer
        const pollAnswer = async () => {
          try {
            const r = await api.get(`/meetings/${id}/answer`);
            if (r.data.answer) {
              await pc.setRemoteDescription(r.data.answer);
              setStatus('connected');
              clearInterval(pollCandidatesInterval);
            }
          } catch (err) {
            // not yet
          }
        };
        const poll = setInterval(pollAnswer, POLL_INTERVAL);

        // poll for joiner candidates
        pollCandidatesInterval = setInterval(async ()=>{
          try {
            const r = await api.get(`/meetings/${id}/candidates?role=host`);
            const cands = r.data.candidates || [];
            for(const c of cands){
              try{ await pc.addIceCandidate(c); }catch(e){}
            }
          } catch(e){}
        }, POLL_INTERVAL);

      } catch (err) {
        console.error(err);
        setStatus('failed');
      }
    };

    const startJoiner = async () => {
      try {
        const pc = new RTCPeerConnection();
        pcRef.current = pc;

        localStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        localVideoRef.current.srcObject = localStreamRef.current;
        localStreamRef.current.getTracks().forEach(t=>pc.addTrack(t, localStreamRef.current));

        pc.ontrack = (ev) => {
          remoteVideoRef.current.srcObject = ev.streams[0];
        };

        pc.onicecandidate = (e) => {
          if (e.candidate) {
            // send candidate as joiner
            api.post(`/meetings/${id}/candidate`, { candidate: e.candidate, role: 'joiner' }).catch(()=>{});
          }
        };

        // get offer
        const r = await api.get(`/meetings/${id}/offer`);
        const offer = r.data.offer;
        await pc.setRemoteDescription(offer);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        await api.post(`/meetings/${id}/answer`, { answer });

        // poll for host candidates
        pollCandidatesInterval = setInterval(async ()=>{
          try {
            const rr = await api.get(`/meetings/${id}/candidates?role=joiner`);
            const cands = rr.data.candidates || [];
            for(const c of cands){
              try{ await pc.addIceCandidate(c); }catch(e){}
            }
          } catch(e){}
        }, POLL_INTERVAL);

        setStatus('connected');
      } catch (err) {
        console.error(err);
        setStatus('failed');
      }
    };

    // if joinMode then act as joiner, else host
    if (joinMode) startJoiner(); else startHost();

    return ()=>{
      mounted = false;
      if (pcRef.current) {
        try { pcRef.current.close(); } catch(e){}
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t=>t.stop());
      }
      if (pollCandidatesInterval) clearInterval(pollCandidatesInterval);
    };
  }, [id, joinMode, api]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white p-4 rounded shadow">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="text-lg font-bold">Meeting</h2>
            <div className="text-sm text-gray-600">Code: <strong>{meetingCode}</strong></div>
            <div className="text-sm text-gray-500">Status: {status}</div>
          </div>
          <div>
            <button onClick={()=>{ navigator.clipboard.writeText(meetingCode); }} className="px-3 py-1 border rounded">Copy Code</button>
            <button onClick={()=>navigate('/')} className="ml-2 px-3 py-1 border rounded">Leave</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black h-64 flex items-center justify-center">
            <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          </div>
          <div className="bg-black h-64 flex items-center justify-center">
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
          </div>
        </div>

      </div>
    </div>
  );
}
