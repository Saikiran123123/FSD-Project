import express from 'express';
import {
  getReviews,
  createReview,
  likeReview,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getReviews);
router.post('/', protect, createReview);
router.post('/:id/like', likeReview);

export default router;
