import express from 'express';
import {
  createMeeting,
  postOffer,
  getOffers,
  getOffer,
  postAnswer,
  getAnswers,
  getAnswer,
  postCandidate,
  getCandidates,
  deleteMeeting
} from '../controllers/meetingController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// create a new meeting and return id
router.post('/', verifyToken, createMeeting);

// offer/answer/candidates signaling endpoints
router.post('/:id/offer', verifyToken, postOffer);
router.get('/:id/offers', verifyToken, getOffers);
router.get('/:id/offer', verifyToken, getOffer);

router.post('/:id/answer', verifyToken, postAnswer);
router.get('/:id/answers', verifyToken, getAnswers);
router.get('/:id/answer', verifyToken, getAnswer);

router.post('/:id/candidate', verifyToken, postCandidate);
router.get('/:id/candidates', verifyToken, getCandidates);

// optional: delete meeting
router.delete('/:id', verifyToken, deleteMeeting);

export default router;
