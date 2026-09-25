import { recommendationService } from '../services/recommendationService.js';

export const getMovieRecommendations = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    const recommendations = await recommendationService.getMovieRecommendations(userId);
    res.json({ success: true, count: recommendations.length, data: recommendations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
