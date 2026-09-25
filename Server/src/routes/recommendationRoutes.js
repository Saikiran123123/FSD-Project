import express from 'express';
import { getMovieRecommendations } from '../controllers/recommendationController.js';

const router = express.Router();

router.get('/movies', getMovieRecommendations);

export default router;
