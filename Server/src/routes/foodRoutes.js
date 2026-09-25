import express from 'express';
import {
  getFoodItems,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
} from '../controllers/foodController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getFoodItems);
router.post('/', protect, admin, createFoodItem);
router.put('/:id', protect, admin, updateFoodItem);
router.delete('/:id', protect, admin, deleteFoodItem);

export default router;
