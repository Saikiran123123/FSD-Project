import API from './api';

export const movieService = {
  // Discover movies with dynamic multi-criteria filters
  async discoverMovies({
    page = 1,
    language = '',
    genre = '',
    year = '',
    sortBy = 'popularity.desc',
    region = '',
  } = {}) {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (language && language !== 'all') params.append('language', language);
    if (genre && genre !== 'All' && genre !== 'all') params.append('genre', genre);
    if (year && year !== 'All' && year !== 'all') params.append('year', year);
    if (sortBy) params.append('sortBy', sortBy);
    if (region) params.append('region', region);

    const res = await API.get(`/movies/discover?${params.toString()}`);
    return res.data;
  },

  // Get movies by specific language code (te, hi, ta, ml, kn, en, etc.)
  async getMoviesByLanguage(languageCode, page = 1) {
    const res = await API.get(`/movies/by-language/${languageCode}?page=${page}`);
    return res.data;
  },

  // Now Playing movies with optional language & region
  async getNowPlaying(page = 1, options = {}) {
    const params = new URLSearchParams({ page });
    if (options.language && options.language !== 'all') params.append('language', options.language);
    if (options.region) params.append('region', options.region);
    const res = await API.get(`/movies/now-playing?${params.toString()}`);
    return res.data;
  },

  // Popular movies
  async getPopular(page = 1, options = {}) {
    const params = new URLSearchParams({ page });
    if (options.language && options.language !== 'all') params.append('language', options.language);
    const res = await API.get(`/movies/popular?${params.toString()}`);
    return res.data;
  },

  // Upcoming movies
  async getUpcoming(page = 1, options = {}) {
    const params = new URLSearchParams({ page });
    if (options.language && options.language !== 'all') params.append('language', options.language);
    if (options.region) params.append('region', options.region);
    const res = await API.get(`/movies/upcoming?${params.toString()}`);
    return res.data;
  },

  // Top Rated movies
  async getTopRated(page = 1, options = {}) {
    const params = new URLSearchParams({ page });
    if (options.language && options.language !== 'all') params.append('language', options.language);
    const res = await API.get(`/movies/top-rated?${params.toString()}`);
    return res.data;
  },

  // Search movies across TMDB with debouncing and optional filters
  async searchMovies(query, page = 1, options = {}) {
    if (!query || !query.trim()) return { success: true, results: [], total_pages: 0, total_results: 0 };
    const params = new URLSearchParams({
      q: query.trim(),
      page,
    });
    if (options.language && options.language !== 'all') params.append('language', options.language);
    if (options.year && options.year !== 'All') params.append('year', options.year);

    const res = await API.get(`/movies/search?${params.toString()}`);
    return res.data;
  },

  // Movie Details by TMDB ID
  async getMovieDetails(tmdbId) {
    const res = await API.get(`/movies/${tmdbId}`);
    return res.data;
  },

  // All Genres from TMDB
  async getGenres() {
    const res = await API.get('/movies/genres');
    return res.data;
  },
};

export default movieService;
