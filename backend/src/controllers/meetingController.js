import { randomUUID } from 'crypto';

// In-memory store for meetings. Key: id, Value: { id, offer, answer, candidates: {host:[],joiner:[]}, meta }
const meetings = new Map();

export const createMeeting = (req, res) => {
  const id = randomUUID();
  const meeting = {
    id,
    offer: null,
    answer: null,
    candidates: { host: [], joiner: [] },
    meta: { createdAt: Date.now(), host: req.user?.id || null }
  };
  meetings.set(id, meeting);
  res.json({ id });
};

export const postOffer = (req, res) => {
  const { id } = req.params;
  const { offer } = req.body;
  const m = meetings.get(id);
  if (!m) return res.status(404).json({ message: 'Meeting not found' });
  m.offer = offer;
  res.json({ ok: true });
};

export const getOffer = (req, res) => {
  const { id } = req.params;
  const m = meetings.get(id);
  if (!m || !m.offer) return res.status(404).json({ message: 'Offer not found' });
  res.json({ offer: m.offer });
};

export const postAnswer = (req, res) => {
  const { id } = req.params;
  const { answer } = req.body;
  const m = meetings.get(id);
  if (!m) return res.status(404).json({ message: 'Meeting not found' });
  m.answer = answer;
  res.json({ ok: true });
};

export const getAnswer = (req, res) => {
  const { id } = req.params;
  const m = meetings.get(id);
  if (!m || !m.answer) return res.status(404).json({ message: 'Answer not found' });
  res.json({ answer: m.answer });
};

export const postCandidate = (req, res) => {
  const { id } = req.params;
  const { candidate, role } = req.body; // role: 'host' | 'joiner'
  const m = meetings.get(id);
  if (!m) return res.status(404).json({ message: 'Meeting not found' });
  if (!role || !['host', 'joiner'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
  m.candidates[role].push(candidate);
  res.json({ ok: true });
};

export const getCandidates = (req, res) => {
  const { id } = req.params;
  const { role } = req.query; // role to fetch candidates for the caller's role (they want the other side's candidates)
  const m = meetings.get(id);
  if (!m) return res.status(404).json({ message: 'Meeting not found' });
  // if role is host, return joiner candidates (i.e., other side)
  if (!role) return res.json({ candidates: m.candidates });
  const other = role === 'host' ? 'joiner' : 'host';
  res.json({ candidates: m.candidates[other] || [] });
};

export const deleteMeeting = (req, res) => {
  const { id } = req.params;
  meetings.delete(id);
  res.json({ ok: true });
};
