import { randomUUID } from 'crypto';

// meetings store supports multi-peer signaling
// meeting: {
//   id,
//   meta: { createdAt, host },
//   offers: { [peerId]: RTCSessionDescription }, // offers from joiners
//   answers: { [peerId]: RTCSessionDescription }, // answers from host for each peer
//   candidates: { [peerId]: { host: [], joiner: [] } }
// }
const meetings = new Map();

const ensurePeerSlots = (m, peerId) => {
  if (!m.offers) m.offers = {};
  if (!m.answers) m.answers = {};
  if (!m.candidates) m.candidates = {};
  if (!m.candidates[peerId]) m.candidates[peerId] = { host: [], joiner: [] };
};

export const createMeeting = (req, res) => {
  const id = randomUUID();
  const meeting = {
    id,
    offers: {},
    answers: {},
    candidates: {},
    meta: { createdAt: Date.now(), host: req.user?.id || null }
  };
  meetings.set(id, meeting);
  res.json({ id });
};

// Joiner posts an offer (includes peerId)
export const postOffer = (req, res) => {
  const { id } = req.params;
  const { offer, peerId } = req.body;
  if (!peerId) return res.status(400).json({ message: 'peerId required' });
  const m = meetings.get(id);
  if (!m) return res.status(404).json({ message: 'Meeting not found' });
  ensurePeerSlots(m, peerId);
  m.offers[peerId] = offer;
  res.json({ ok: true });
};

// Host can list all offers
export const getOffers = (req, res) => {
  const { id } = req.params;
  const m = meetings.get(id);
  if (!m) return res.status(404).json({ message: 'Meeting not found' });
  res.json({ offers: m.offers || {} });
};

// Get specific offer for peerId
export const getOffer = (req, res) => {
  const { id } = req.params;
  const { peerId } = req.query;
  const m = meetings.get(id);
  if (!m) return res.status(404).json({ message: 'Meeting not found' });
  if (!peerId) return res.status(400).json({ message: 'peerId required' });
  const o = (m.offers || {})[peerId];
  if (!o) return res.status(404).json({ message: 'Offer not found' });
  res.json({ offer: o });
};

// Host posts an answer for a specific peerId
export const postAnswer = (req, res) => {
  const { id } = req.params;
  const { answer, peerId } = req.body;
  if (!peerId) return res.status(400).json({ message: 'peerId required' });
  const m = meetings.get(id);
  if (!m) return res.status(404).json({ message: 'Meeting not found' });
  ensurePeerSlots(m, peerId);
  m.answers[peerId] = answer;
  res.json({ ok: true });
};

export const getAnswers = (req, res) => {
  const { id } = req.params;
  const m = meetings.get(id);
  if (!m) return res.status(404).json({ message: 'Meeting not found' });
  res.json({ answers: m.answers || {} });
};

export const getAnswer = (req, res) => {
  const { id } = req.params;
  const { peerId } = req.query;
  const m = meetings.get(id);
  if (!m) return res.status(404).json({ message: 'Meeting not found' });
  if (!peerId) return res.status(400).json({ message: 'peerId required' });
  const a = (m.answers || {})[peerId];
  if (!a) return res.status(404).json({ message: 'Answer not found' });
  res.json({ answer: a });
};

export const postCandidate = (req, res) => {
  const { id } = req.params;
  const { candidate, peerId, role } = req.body; // role: 'host' | 'joiner'
  if (!peerId) return res.status(400).json({ message: 'peerId required' });
  const m = meetings.get(id);
  if (!m) return res.status(404).json({ message: 'Meeting not found' });
  if (!role || !['host', 'joiner'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
  ensurePeerSlots(m, peerId);
  m.candidates[peerId][role].push(candidate);
  res.json({ ok: true });
};

export const getCandidates = (req, res) => {
  const { id } = req.params;
  const { peerId } = req.query;
  const m = meetings.get(id);
  if (!m) return res.status(404).json({ message: 'Meeting not found' });
  if (!peerId) return res.json({ candidates: m.candidates || {} });
  const c = (m.candidates || {})[peerId] || { host: [], joiner: [] };
  res.json({ candidates: c });
};

export const deleteMeeting = (req, res) => {
  const { id } = req.params;
  meetings.delete(id);
  res.json({ ok: true });
};
