import express from 'express';
import {
  getTheatres,
  getTheatreById,
  createTheatre,
  updateTheatre,
} from '../controllers/theatreController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getTheatres);
router.get('/:id', getTheatreById);
router.post('/', protect, admin, createTheatre);
router.put('/:id', protect, admin, updateTheatre);

export default router;
