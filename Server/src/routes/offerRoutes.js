import express from 'express';
import {
  getActiveOffers,
  validateOffer,
  createOffer,
} from '../controllers/offerController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getActiveOffers);
router.post('/validate', protect, validateOffer);
router.post('/', protect, admin, createOffer);

export default router;
