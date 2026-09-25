import { tmdbService } from '../services/tmdbService.js';

// @desc    Discover movies with dynamic filters (Language, Genre, Year, Sort)
// @route   GET /api/movies/discover
// @access  Public
export const discoverMovies = async (req, res) => {
  try {
    const {
      page = 1,
      language,
      with_original_language,
      genre,
      with_genres,
      year,
      primary_release_year,
      sortBy,
      sort_by,
      region,
    } = req.query;

    const data = await tmdbService.discoverMovies({
      page: parseInt(page) || 1,
      with_original_language: with_original_language || language || '',
      with_genres: with_genres || genre || '',
      primary_release_year: primary_release_year || year || '',
      sort_by: sort_by || sortBy || 'popularity.desc',
      region: region || '',
    });

    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get movies by specific language (e.g. te, hi, ta, ml, kn, en)
// @route   GET /api/movies/by-language/:lang
// @access  Public
export const getMoviesByLanguage = async (req, res) => {
  try {
    const { lang } = req.params;
    const page = parseInt(req.query.page) || 1;
    const data = await tmdbService.getMoviesByLanguage(lang, page);
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get now playing movies
// @route   GET /api/movies/now-playing
// @access  Public
export const getNowPlayingMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const language = req.query.language || req.query.with_original_language || '';
    const region = req.query.region || '';
    const data = await tmdbService.getNowPlaying(page, { with_original_language: language, region });
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get popular movies
// @route   GET /api/movies/popular
// @access  Public
export const getPopularMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const language = req.query.language || req.query.with_original_language || '';
    const data = await tmdbService.getPopular(page, { with_original_language: language });
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get upcoming movies
// @route   GET /api/movies/upcoming
// @access  Public
export const getUpcomingMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const language = req.query.language || req.query.with_original_language || '';
    const data = await tmdbService.getUpcoming(page, { with_original_language: language });
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get top rated movies
// @route   GET /api/movies/top-rated
// @access  Public
export const getTopRatedMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const language = req.query.language || req.query.with_original_language || '';
    const data = await tmdbService.getTopRated(page, { with_original_language: language });
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Search movies
// @route   GET /api/movies/search
// @access  Public
export const searchMovies = async (req, res) => {
  try {
    const { q, query, page, language, with_original_language, year } = req.query;
    const searchQuery = q || query || '';
    const data = await tmdbService.searchMovies(searchQuery, parseInt(page) || 1, {
      with_original_language: with_original_language || language,
      primary_release_year: year,
    });
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get movie details by TMDB ID
// @route   GET /api/movies/:id
// @access  Public
export const getMovieDetails = async (req, res) => {
  try {
    const movie = await tmdbService.getMovieDetails(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    res.json({ success: true, data: movie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get movie genres
// @route   GET /api/movies/genres
// @access  Public
export const getMovieGenres = async (req, res) => {
  try {
    const genres = await tmdbService.getGenres();
    res.json({ success: true, data: genres });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
