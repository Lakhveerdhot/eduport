import React, { useEffect, useRef, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const POLL_INTERVAL = 1000;

function genPeerId(){
  try { return window.crypto && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.floor(Math.random()*10000)}`; }
  catch(e){ return `${Date.now()}-${Math.floor(Math.random()*10000)}`; }
}

export default function InstantMeeting(){
  const { id: meetingId } = useParams();
  const loc = useLocation();
  const search = new URLSearchParams(loc.search);
  const joinMode = search.get('join') === '1' || search.get('join') === 'true';
  const { api, user } = useAuth();
  const navigate = useNavigate();

  const localVideoRef = useRef();
  const localStreamRef = useRef(null);
  const attachLocalToEl = (el) => { if (el && localStreamRef.current) el.srcObject = localStreamRef.current; };
  const pcMapRef = useRef({});
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [status, setStatus] = useState('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [peerId] = useState(() => genPeerId());

  useEffect(()=>{
    let mounted = true;
    let pollOffersInterval = null;
    let pollCandidatesInterval = null;
    let answerPollInterval = null;

    const startLocal = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ 
          audio: { echoCancellation: true },
          video: { width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        if (mounted) {
          localStreamRef.current = s;
          if (localVideoRef.current) localVideoRef.current.srcObject = s;
          setLocalStream(s);
        }
      } catch (err) {
        console.error('getUserMedia failed', err);
        setStatus('failed');
      }
    };

    const startHost = async () => {
      await startLocal();
      setStatus('connected'); // Host is ready, not waiting

      const processOffers = async () => {
        try {
          const res = await api.get(`/meetings/${meetingId}/offers`);
          const offers = res.data.offers || {};
          for(const pId of Object.keys(offers)){
            if (pcMapRef.current[pId]) continue;
            const offer = offers[pId];
            const pc = new RTCPeerConnection({ iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] });
            pcMapRef.current[pId] = pc;

            if (localStreamRef.current) localStreamRef.current.getTracks().forEach(t=>pc.addTrack(t, localStreamRef.current));

            pc.ontrack = (ev) => {
              setRemoteStreams(prev => ({ ...prev, [pId]: ev.streams[0] }));
            };

            pc.onicecandidate = (e) => {
              if (e.candidate) {
                api.post(`/meetings/${meetingId}/candidate`, { candidate: e.candidate, peerId: pId, role: 'host' }).catch(()=>{});
              }
            };

            try {
              await pc.setRemoteDescription(offer);
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              await api.post(`/meetings/${meetingId}/answer`, { answer, peerId: pId });
            } catch (e) {
              console.error('Error processing offer:', e);
            }
          }
        } catch (err) {
          console.error('processOffers error:', err);
        }
      };

      processOffers();
      pollOffersInterval = setInterval(processOffers, POLL_INTERVAL);

      pollCandidatesInterval = setInterval(async ()=>{
        try {
          const rr = await api.get(`/meetings/${meetingId}/candidates`);
          const all = rr.data.candidates || {};
          Object.keys(all).forEach(peer => {
            const entry = all[peer];
            const pc = pcMapRef.current[peer];
            if (!pc) return;
            (entry.joiner || []).forEach(async c => {
              try{ await pc.addIceCandidate(c); }catch(e){}
            });
          });
        } catch(e){}
      }, POLL_INTERVAL);
    };

    const startJoiner = async () => {
      try {
        await startLocal();
        const pc = new RTCPeerConnection({ iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] });
        pcMapRef.current['host'] = pc;

        if (localStreamRef.current) localStreamRef.current.getTracks().forEach(t=>pc.addTrack(t, localStreamRef.current));

        pc.ontrack = (ev) => {
          setRemoteStreams(prev => ({ ...prev, host: ev.streams[0] }));
        };

        pc.onicecandidate = (e) => {
          if (e.candidate) {
            api.post(`/meetings/${meetingId}/candidate`, { candidate: e.candidate, peerId, role: 'joiner' }).catch(()=>{});
          }
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await api.post(`/meetings/${meetingId}/offer`, { offer, peerId });

        const waitForAnswer = async () => {
          try {
            const r = await api.get(`/meetings/${meetingId}/answer`, { params: { peerId } });
            if (r.data.answer && !pc.remoteDescription) {
              await pc.setRemoteDescription(r.data.answer);
              setStatus('connected');
              clearInterval(answerPollInterval);
            }
          } catch(e){}
        };

        answerPollInterval = setInterval(waitForAnswer, POLL_INTERVAL);

        pollCandidatesInterval = setInterval(async ()=>{
          try {
            const rr = await api.get(`/meetings/${meetingId}/candidates`, { params: { peerId } });
            const cands = (rr.data && rr.data.candidates) ? rr.data.candidates : {};
            const hostC = cands.host || [];
            for(const c of hostC){
              try{ await pc.addIceCandidate(c); }catch(e){}
            }
          } catch(e){}
        }, POLL_INTERVAL);

      } catch (err) {
        console.error('startJoiner error:', err);
        setStatus('failed');
      }
    };

    if (joinMode) startJoiner(); else startHost();

    return ()=>{
      mounted = false;
      try {
        Object.values(pcMapRef.current).forEach(pc => { try{ pc.close(); }catch(e){} });
      } catch(e){}
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t=>t.stop());
      }
      if (pollOffersInterval) clearInterval(pollOffersInterval);
      if (pollCandidatesInterval) clearInterval(pollCandidatesInterval);
      if (answerPollInterval) clearInterval(answerPollInterval);
    };
  }, [meetingId, joinMode, api, peerId]);

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(t=> t.enabled = !isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(t=> t.enabled = !isVideoOn);
      setIsVideoOn(!isVideoOn);
    }
  };

  const endCall = async () => {
    try {
      Object.values(pcMapRef.current).forEach(pc => pc.close());
      pcMapRef.current = {};
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t=>t.stop());
      }
      await api.delete(`/meetings/${meetingId}`).catch(()=>{});
    } catch(e){}
    navigate('/');
  };

  const copyCode = () => {
    navigator.clipboard.writeText(meetingId);
    alert('Meeting code copied!');
  };

  const participants = Object.keys(remoteStreams);
  const hasRemotes = participants.length > 0;
  const mainPeerId = hasRemotes ? participants[0] : null;

  return (
    <div className="h-screen bg-black flex flex-col">
      {/* Main video area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Primary video (large) */}
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          {joinMode ? (
            remoteStreams.host ? (
              <video
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                ref={el => { if (el) el.srcObject = remoteStreams.host; }}
              />
            ) : (
              <div className="text-white">Waiting for host to start video...</div>
            )
          ) : (
            mainPeerId && remoteStreams[mainPeerId] ? (
              <video
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                ref={el => { if (el && remoteStreams[mainPeerId]) el.srcObject = remoteStreams[mainPeerId]; }}
              />
            ) : localStream ? (
              <video autoPlay muted playsInline ref={attachLocalToEl} className="w-full h-full object-cover" />
            ) : (
              <div className="text-white">Initializing video...</div>
            )
          )}
        </div>

        {/* PiP videos (corners) */}
        {hasRemotes && !joinMode && (
          <div className="absolute top-4 right-4 flex flex-col gap-2 max-h-[40%] overflow-y-auto">
            {/* Local video */}
            <div className="relative w-32 h-24 bg-gray-800 rounded border border-gray-500">
              <video autoPlay muted playsInline ref={attachLocalToEl} className="w-full h-full object-cover" />
              <div className="absolute bottom-1 left-1 text-xs bg-black/70 text-white px-1 py-0.5 rounded">You</div>
            </div>
            {/* Remaining remote videos */}
            {participants.slice(1).map((p, idx) => (
              <div key={p} className="relative w-32 h-24 bg-gray-800 rounded border border-gray-500">
                <video autoPlay playsInline className="w-full h-full object-cover" ref={el => { if (el && remoteStreams[p]) el.srcObject = remoteStreams[p]; }} />
                <div className="absolute bottom-1 left-1 text-xs bg-black/70 text-white px-1 py-0.5 rounded">Student {idx+2}</div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom right: local video for joiner */}
        {joinMode && (
          <div className="absolute bottom-24 right-4 w-40 h-32 bg-gray-800 rounded border border-gray-500 overflow-hidden">
            <video autoPlay muted playsInline ref={attachLocalToEl} className="w-full h-full object-cover" />
            <div className="absolute bottom-1 left-1 text-sm bg-black/70 text-white px-2 py-1 rounded">You</div>
          </div>
        )}
      </div>

      {/* Control bar */}
      <div className="bg-gray-900 border-t border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="text-white text-sm flex items-center gap-4">
          <span><strong>Code:</strong> <code className="bg-gray-800 px-2 py-1 rounded font-mono">{meetingId}</code></span>
          <span><strong>Status:</strong> {status}</span>
          <span><strong>Participants:</strong> {1 + participants.length}</span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={copyCode} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center gap-2" title="Copy code">
            📋 Share
          </button>
          <button onClick={toggleMute} className={`px-3 py-2 rounded text-white ${isMuted ? 'bg-red-600' : 'bg-gray-700'} hover:bg-gray-600`} title={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted ? '🔇' : '🎤'}
          </button>
          <button onClick={toggleVideo} className={`px-3 py-2 rounded text-white ${!isVideoOn ? 'bg-red-600' : 'bg-gray-700'} hover:bg-gray-600`} title={isVideoOn ? 'Stop video' : 'Start video'}>
            {isVideoOn ? '📹' : '🚫'}
          </button>
          <button onClick={() => setShowParticipants(!showParticipants)} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded" title="Participants">
            👥 ({1 + participants.length})
          </button>
          <button onClick={endCall} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2">
            ☎️ End
          </button>
        </div>
      </div>

      {/* Participants panel */}
      {showParticipants && (
        <div className="bg-gray-800 border-t border-gray-700 px-6 py-3 max-h-24 overflow-y-auto">
          <h4 className="text-white font-bold mb-2">In Meeting ({1 + participants.length})</h4>
          <div className="flex flex-wrap gap-2">
            <div className="bg-gray-700 text-white px-3 py-1 rounded text-sm">{user?.fullName} (You)</div>
            {participants.map((p, i) => (
              <div key={p} className="bg-gray-700 text-white px-3 py-1 rounded text-sm">Student {i + 1}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
