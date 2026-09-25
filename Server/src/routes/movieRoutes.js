import express from 'express';
import {
  discoverMovies,
  getNowPlayingMovies,
  getPopularMovies,
  getUpcomingMovies,
  getTopRatedMovies,
  getMoviesByLanguage,
  searchMovies,
  getMovieDetails,
  getMovieGenres,
} from '../controllers/movieController.js';

const router = express.Router();

router.get('/discover', discoverMovies);
router.get('/now-playing', getNowPlayingMovies);
router.get('/popular', getPopularMovies);
router.get('/upcoming', getUpcomingMovies);
router.get('/top-rated', getTopRatedMovies);
router.get('/by-language/:lang', getMoviesByLanguage);
router.get('/search', searchMovies);
router.get('/genres', getMovieGenres);
router.get('/:id', getMovieDetails);

export default router;
