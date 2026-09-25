import express from 'express';
import {
  getShowsByMovie,
  getShowSeats,
  holdSeats,
  releaseSeats,
  getSmartSeatRecommendations,
  getGroupSeatRecommendations,
  createShow,
} from '../controllers/showController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/movie/:tmdbId', getShowsByMovie);
router.get('/:id/seats', getShowSeats);
router.get('/:id/smart-seats', getSmartSeatRecommendations);
router.get('/:id/group-seats', getGroupSeatRecommendations);
router.post('/:id/hold-seats', protect, holdSeats);
router.post('/:id/release-seats', protect, releaseSeats);
router.post('/', protect, admin, createShow);

export default router;
