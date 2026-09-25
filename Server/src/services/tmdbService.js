import 'dotenv/config';
import axios from 'axios';

// In-memory cache with TTL
const cache = new Map();

const setCache = (key, data, ttlMs = 15 * 60 * 1000) => {
  cache.set(key, {
    data,
    expiry: Date.now() + ttlMs,
  });
};

const getCache = (key) => {
  const cached = cache.get(key);
  if (!cached) return null;
  if (Date.now() > cached.expiry) {
    cache.delete(key);
    return null;
  }
  return cached.data;
};

export const GENRE_MAP = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

export const GENRE_NAME_TO_ID = {
  ...Object.fromEntries(Object.entries(GENRE_MAP).map(([id, name]) => [name.toLowerCase(), Number(id)])),
  'sci-fi': 878,
  'science fiction': 878,
};

export const LANGUAGE_NAMES = {
  te: 'Telugu',
  hi: 'Hindi',
  ta: 'Tamil',
  ml: 'Malayalam',
  kn: 'Kannada',
  en: 'English',
  mr: 'Marathi',
  bn: 'Bengali',
  pa: 'Punjabi',
  gu: 'Gujarati',
  or: 'Odia',
  as: 'Assamese',
  ko: 'Korean',
  ja: 'Japanese',
  zh: 'Chinese',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  ru: 'Russian',
  pt: 'Portuguese',
  ar: 'Arabic',
};

// Curated Fallback Movie Catalog (Multi-language including Telugu, Hindi, Tamil, English)
export const FALLBACK_MOVIES = [
  {
    id: 579974,
    title: 'RRR',
    original_title: 'రౌద్రం రణం రుధిరం',
    overview: 'A fictional history of two legendary revolutionaries’ journey away from home before they began fighting for their country in the 1920s.',
    poster_path: '/nEufeZlyAOLqO2brrs0ye2rrHg6.jpg',
    backdrop_path: '/22z8hp1q4hJk7F7i6DCB5X7g5bT.jpg',
    release_date: '2022-03-24',
    vote_average: 7.8,
    vote_count: 1450,
    popularity: 380.0,
    runtime: 187,
    original_language: 'te',
    genres: [{ id: 28, name: 'Action' }, { id: 18, name: 'Drama' }],
    status: 'now_playing',
    certification: 'UA',
    cast: [
      { id: 11090, name: 'N.T. Rama Rao Jr.', character: 'Komaram Bheem' },
      { id: 11088, name: 'Ram Charan', character: 'Alluri Sitarama Raju' },
      { id: 11089, name: 'Alia Bhatt', character: 'Sita' },
    ],
  },
  {
    id: 693134,
    title: 'Dune: Part Two',
    original_title: 'Dune: Part Two',
    overview: 'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.',
    tagline: 'Long live the fighters.',
    poster_path: '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdrop_path: '/xOMo8BRK7PfcJv9JCnx7s520b4q.jpg',
    release_date: '2024-03-01',
    vote_average: 8.3,
    vote_count: 5400,
    popularity: 420.5,
    runtime: 166,
    original_language: 'en',
    genres: [{ id: 878, name: 'Science Fiction' }, { id: 12, name: 'Adventure' }],
    status: 'now_playing',
    certification: 'UA',
    cast: [
      { id: 1190668, name: 'Timothée Chalamet', character: 'Paul Atreides' },
      { id: 505710, name: 'Zendaya', character: 'Chani' },
    ],
  },
  {
    id: 998844,
    title: 'Pushpa 2 - The Rule',
    original_title: 'పుష్ప 2: ది రూల్',
    overview: 'Pushpa Raj continues his reign over the red sandalwood smuggling empire while locking horns with SP Bhanwar Singh Shekhawat.',
    poster_path: '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdrop_path: '/xOMo8BRK7PfcJv9JCnx7s520b4q.jpg',
    release_date: '2024-12-05',
    vote_average: 8.0,
    vote_count: 1200,
    popularity: 510.0,
    runtime: 180,
    original_language: 'te',
    genres: [{ id: 28, name: 'Action' }, { id: 80, name: 'Crime' }],
    status: 'now_playing',
    certification: 'UA',
    cast: [
      { id: 11085, name: 'Allu Arjun', character: 'Pushpa Raj' },
      { id: 11086, name: 'Rashmika Mandanna', character: 'Srivalli' },
      { id: 11087, name: 'Fahadh Faasil', character: 'Bhanwar Singh Shekhawat' },
    ],
  },
  {
    id: 533535,
    title: 'Deadpool & Wolverine',
    original_title: 'Deadpool & Wolverine',
    overview: 'A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary behind him.',
    poster_path: '/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    backdrop_path: '/yD3aK9VvO1HkQ6G9MvG6y5w9w2.jpg',
    release_date: '2024-07-26',
    vote_average: 7.9,
    vote_count: 4800,
    popularity: 580.2,
    runtime: 127,
    original_language: 'en',
    genres: [{ id: 28, name: 'Action' }, { id: 35, name: 'Comedy' }],
    status: 'now_playing',
    certification: 'A',
    cast: [
      { id: 10859, name: 'Ryan Reynolds', character: 'Wade Wilson' },
      { id: 6968, name: 'Hugh Jackman', character: 'Logan' },
    ],
  },
  {
    id: 872585,
    title: 'Jawan',
    original_title: 'Jawan',
    overview: 'A high-octane action thriller that outlines the emotional journey of a man who is set to rectify the wrongs in the society.',
    poster_path: '/jYW3rGk7kEaPz772X5wK1y3sP2k.jpg',
    backdrop_path: '/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg',
    release_date: '2023-09-07',
    vote_average: 7.5,
    vote_count: 3200,
    popularity: 340.0,
    runtime: 169,
    original_language: 'hi',
    genres: [{ id: 28, name: 'Action' }, { id: 53, name: 'Thriller' }],
    status: 'now_playing',
    certification: 'UA',
    cast: [
      { id: 35742, name: 'Shah Rukh Khan', character: 'Vikram Rathore / Azad' },
      { id: 85382, name: 'Nayanthara', character: 'Narmada Rai' },
    ],
  },
  {
    id: 1083862,
    title: 'Leo',
    original_title: 'Leo',
    overview: 'Parthiban is a mild-mannered cafe owner in Thekkady, who becomes a local hero when he takes down a gang of murderous thugs.',
    poster_path: '/pIQnJ58eU9n5sA1L2r1n0k9b4q.jpg',
    backdrop_path: '/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg',
    release_date: '2023-10-19',
    vote_average: 7.6,
    vote_count: 2400,
    popularity: 320.0,
    runtime: 164,
    original_language: 'ta',
    genres: [{ id: 28, name: 'Action' }, { id: 80, name: 'Crime' }],
    status: 'now_playing',
    certification: 'UA',
    cast: [
      { id: 88782, name: 'Thalapathy Vijay', character: 'Leo Das / Parthiban' },
      { id: 88783, name: 'Trisha Krishnan', character: 'Sathya' },
    ],
  },
  {
    id: 1184918,
    title: 'The Wild Robot',
    original_title: 'The Wild Robot',
    overview: 'After a shipwreck, an intelligent robot called Roz is stranded on an uninhabited island and must learn to adapt to the harsh surroundings.',
    poster_path: '/wTnV3PCVW5O92JMrFvvrRil39nM.jpg',
    backdrop_path: '/417tYZ4XUyJrdyZXWs3xw3D3b.jpg',
    release_date: '2024-09-27',
    vote_average: 8.4,
    vote_count: 3600,
    popularity: 310.0,
    runtime: 102,
    original_language: 'en',
    genres: [{ id: 16, name: 'Animation' }, { id: 878, name: 'Science Fiction' }],
    status: 'upcoming',
    certification: 'U',
    cast: [
      { id: 1267329, name: 'Lupita Nyong\'o', character: 'Roz (voice)' },
    ],
  },
  {
    id: 1022789,
    title: 'Manjummel Boys',
    original_title: 'Manjummel Boys',
    overview: 'A group of friends from a small town embark on a vacation to Kodaikanal, but things turn perilous when one of them falls into the Guna Caves.',
    poster_path: '/7m3j8H5c8vP9L0k9q8v6m5k1n.jpg',
    backdrop_path: '/xg27NrXi7vCGUrsqm7eg9vSM8eq.jpg',
    release_date: '2024-02-22',
    vote_average: 8.2,
    vote_count: 1800,
    popularity: 290.0,
    runtime: 135,
    original_language: 'ml',
    genres: [{ id: 12, name: 'Adventure' }, { id: 53, name: 'Thriller' }],
    status: 'now_playing',
    certification: 'U',
    cast: [
      { id: 120931, name: 'Soubin Shahir', character: 'Kuttan' },
      { id: 120932, name: 'Sreenath Bhasi', character: 'Subhash' },
    ],
  },
  {
    id: 978931,
    title: 'Kantara',
    original_title: 'ಕಾಂತಾರ',
    overview: 'When greed paves the way for betrayal and deceit, a young tribal man reluctantly embraces his ancestors’ spiritual legacy.',
    poster_path: '/b6pP6q8h2k9v1s0m5n9q7k.jpg',
    backdrop_path: '/zSWdZVtXT7Eb5n9q7k1m0v.jpg',
    release_date: '2022-09-30',
    vote_average: 8.1,
    vote_count: 2100,
    popularity: 280.0,
    runtime: 148,
    original_language: 'kn',
    genres: [{ id: 28, name: 'Action' }, { id: 18, name: 'Drama' }, { id: 53, name: 'Thriller' }],
    status: 'now_playing',
    certification: 'UA',
    cast: [
      { id: 130981, name: 'Rishab Shetty', character: 'Shiva' },
      { id: 130982, name: 'Sapthami Gowda', character: 'Leela' },
    ],
  },
];

const getApiKey = () => process.env.TMDB_API_KEY || 'a01999141f43c22037f2463bd0c48144';
const getBaseUrl = () => process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = process.env.TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

// Helper to make TMDB HTTP requests with caching & fallback
const fetchFromTMDB = async (endpoint, params = {}, cacheKey, ttlMs) => {
  if (cacheKey) {
    const cached = getCache(cacheKey);
    if (cached) return cached;
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return null;
  }

  try {
    const response = await axios.get(`${getBaseUrl()}${endpoint}`, {
      params: {
        api_key: apiKey,
        language: 'en-US', // localized metadata in English for global accessibility
        ...params,
      },
      timeout: 8000,
    });

    if (cacheKey && response.data) {
      setCache(cacheKey, response.data, ttlMs);
    }
    return response.data;
  } catch (error) {
    console.warn(`[TMDB API] Request to ${endpoint} failed (${error.message}). Falling back to cached/fallback catalog.`);
    return null;
  }
};

// Formats movie object, converts image paths to full URLs and expands genre_ids
export const formatMovieImages = (movie) => {
  if (!movie) return null;

  const poster = movie.poster_path
    ? (movie.poster_path.startsWith('http') ? movie.poster_path : `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`)
    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80';

  const backdrop = movie.backdrop_path
    ? (movie.backdrop_path.startsWith('http') ? movie.backdrop_path : `${TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path}`)
    : poster;

  // Resolve genre objects if only genre_ids are provided
  let genres = movie.genres;
  if (!genres && movie.genre_ids && Array.isArray(movie.genre_ids)) {
    genres = movie.genre_ids.map((id) => ({
      id,
      name: GENRE_MAP[id] || 'Cinema',
    }));
  }

  const languageCode = (movie.original_language || 'en').toLowerCase();
  const languageName = LANGUAGE_NAMES[languageCode] || languageCode.toUpperCase();

  return {
    ...movie,
    id: movie.id,
    title: movie.title || movie.original_title || 'Untitled Feature',
    original_title: movie.original_title || movie.title,
    overview: movie.overview || 'Experience the cinematic spectacle in state-of-the-art auditoriums with Dolby Atmos audio.',
    poster_url: poster,
    backdrop_url: backdrop,
    genres: genres || [{ id: 0, name: 'Feature' }],
    original_language: languageCode,
    language_name: languageName,
    vote_average: typeof movie.vote_average === 'number' ? movie.vote_average : 7.5,
    release_date: movie.release_date || '2024-01-01',
  };
};

export const tmdbService = {
  // 1. Discover Movies with rich filters (Language, Genre, Year, Sort, Region)
  async discoverMovies({
    page = 1,
    with_original_language = '',
    with_genres = '',
    primary_release_year = '',
    sort_by = 'popularity.desc',
    region = '',
  } = {}) {
    const params = {
      page,
      sort_by: sort_by || 'popularity.desc',
      include_adult: false,
    };

    // Important: Only add with_original_language if specified and not 'all'
    if (with_original_language && with_original_language !== 'all') {
      params.with_original_language = with_original_language;
    }

    if (with_genres && with_genres !== 'All' && with_genres !== 'all') {
      const normalized = String(with_genres).trim().toLowerCase();
      const resolvedGenreId = !isNaN(with_genres) ? with_genres : GENRE_NAME_TO_ID[normalized] || with_genres;
      params.with_genres = resolvedGenreId;
    }

    if (primary_release_year && primary_release_year !== 'All' && primary_release_year !== 'all') {
      params.primary_release_year = primary_release_year;
    }

    if (region) {
      params.region = region;
    }

    const cacheKey = `discover_lang_${with_original_language}_genre_${with_genres}_yr_${primary_release_year}_sort_${sort_by}_p_${page}`;
    const data = await fetchFromTMDB('/discover/movie', params, cacheKey, 10 * 60 * 1000);

    if (data && data.results) {
      return {
        page: data.page,
        results: data.results.map(formatMovieImages),
        total_pages: data.total_pages,
        total_results: data.total_results,
      };
    }

    // Fallback filter
    let filtered = [...FALLBACK_MOVIES];
    if (with_original_language && with_original_language !== 'all') {
      filtered = filtered.filter((m) => m.original_language === with_original_language);
    }
    return {
      page: 1,
      results: filtered.map(formatMovieImages),
      total_pages: 1,
      total_results: filtered.length,
    };
  },

  // 2. Get Movies by Specific Language (e.g. 'te', 'hi', 'ta', 'ml', 'kn', 'en')
  async getMoviesByLanguage(languageCode, page = 1) {
    return this.discoverMovies({
      page,
      with_original_language: languageCode,
      sort_by: 'popularity.desc',
    });
  },

  // 3. Search Movies across titles, keywords & alternative names
  async searchMovies(query, page = 1, options = {}) {
    if (!query || !query.trim()) {
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }

    const params = {
      query: query.trim(),
      page,
      include_adult: false,
    };

    if (options.primary_release_year) {
      params.primary_release_year = options.primary_release_year;
    }

    if (options.region) {
      params.region = options.region;
    }

    const cacheKey = `search_${encodeURIComponent(query.toLowerCase())}_p${page}_${options.primary_release_year || ''}`;
    const data = await fetchFromTMDB('/search/movie', params, cacheKey, 5 * 60 * 1000);

    if (data && data.results) {
      let results = data.results.map(formatMovieImages);

      // Optional client-side language filter if specified in options
      if (options.with_original_language && options.with_original_language !== 'all') {
        const langFilter = options.with_original_language.toLowerCase();
        results = results.filter((m) => m.original_language === langFilter);
      }

      return {
        page: data.page,
        results,
        total_pages: data.total_pages,
        total_results: data.total_results,
      };
    }

    // Search fallback
    const q = query.toLowerCase();
    const filtered = FALLBACK_MOVIES.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        (m.original_title && m.original_title.toLowerCase().includes(q)) ||
        (m.overview && m.overview.toLowerCase().includes(q))
    );

    return {
      page: 1,
      results: filtered.map(formatMovieImages),
      total_pages: 1,
      total_results: filtered.length,
    };
  },

  // 4. Get Now Playing Movies (Supports optional language or region)
  async getNowPlaying(page = 1, options = {}) {
    if (options.with_original_language && options.with_original_language !== 'all') {
      return this.discoverMovies({
        page,
        with_original_language: options.with_original_language,
        sort_by: 'popularity.desc',
      });
    }

    const cacheKey = `now_playing_p${page}_${options.region || 'IN'}`;
    const data = await fetchFromTMDB(
      '/movie/now_playing',
      { page, region: options.region || 'IN' },
      cacheKey,
      15 * 60 * 1000
    );

    if (data && data.results && data.results.length > 0) {
      return {
        page: data.page,
        results: data.results.map(formatMovieImages),
        total_pages: data.total_pages,
        total_results: data.total_results,
      };
    }

    // If region IN had no results or failed, fallback to global popular/discover
    const globalData = await fetchFromTMDB('/movie/now_playing', { page }, `now_playing_p${page}_global`, 15 * 60 * 1000);
    if (globalData && globalData.results) {
      return {
        page: globalData.page,
        results: globalData.results.map(formatMovieImages),
        total_pages: globalData.total_pages,
        total_results: globalData.total_results,
      };
    }

    return {
      page: 1,
      results: FALLBACK_MOVIES.map(formatMovieImages),
      total_pages: 1,
      total_results: FALLBACK_MOVIES.length,
    };
  },

  // 5. Get Popular Movies
  async getPopular(page = 1, options = {}) {
    if (options.with_original_language && options.with_original_language !== 'all') {
      return this.discoverMovies({
        page,
        with_original_language: options.with_original_language,
        sort_by: 'popularity.desc',
      });
    }

    const cacheKey = `popular_p${page}`;
    const data = await fetchFromTMDB('/movie/popular', { page }, cacheKey, 15 * 60 * 1000);
    if (data && data.results) {
      return {
        page: data.page,
        results: data.results.map(formatMovieImages),
        total_pages: data.total_pages,
        total_results: data.total_results,
      };
    }
    return {
      page: 1,
      results: FALLBACK_MOVIES.map(formatMovieImages),
      total_pages: 1,
      total_results: FALLBACK_MOVIES.length,
    };
  },

  // 6. Get Upcoming Movies
  async getUpcoming(page = 1, options = {}) {
    if (options.with_original_language && options.with_original_language !== 'all') {
      return this.discoverMovies({
        page,
        with_original_language: options.with_original_language,
        sort_by: 'primary_release_date.desc',
      });
    }

    const cacheKey = `upcoming_p${page}`;
    const data = await fetchFromTMDB('/movie/upcoming', { page, region: options.region || 'IN' }, cacheKey, 15 * 60 * 1000);
    if (data && data.results && data.results.length > 0) {
      return {
        page: data.page,
        results: data.results.map(formatMovieImages),
        total_pages: data.total_pages,
        total_results: data.total_results,
      };
    }

    const globalUpcoming = await fetchFromTMDB('/movie/upcoming', { page }, `upcoming_p${page}_global`, 15 * 60 * 1000);
    if (globalUpcoming && globalUpcoming.results) {
      return {
        page: globalUpcoming.page,
        results: globalUpcoming.results.map(formatMovieImages),
        total_pages: globalUpcoming.total_pages,
        total_results: globalUpcoming.total_results,
      };
    }

    const upcoming = FALLBACK_MOVIES.filter((m) => m.status === 'upcoming');
    return {
      page: 1,
      results: upcoming.map(formatMovieImages),
      total_pages: 1,
      total_results: upcoming.length,
    };
  },

  // 7. Get Top Rated Movies
  async getTopRated(page = 1, options = {}) {
    if (options.with_original_language && options.with_original_language !== 'all') {
      return this.discoverMovies({
        page,
        with_original_language: options.with_original_language,
        sort_by: 'vote_average.desc',
      });
    }

    const cacheKey = `top_rated_p${page}`;
    const data = await fetchFromTMDB('/movie/top_rated', { page }, cacheKey, 20 * 60 * 1000);
    if (data && data.results) {
      return {
        page: data.page,
        results: data.results.map(formatMovieImages),
        total_pages: data.total_pages,
        total_results: data.total_results,
      };
    }
    return {
      page: 1,
      results: FALLBACK_MOVIES.map(formatMovieImages),
      total_pages: 1,
      total_results: FALLBACK_MOVIES.length,
    };
  },

  // 8. Get Movie Details (Full metadata with cast, crew, videos)
  async getMovieDetails(tmdbId) {
    const id = Number(tmdbId);
    const cacheKey = `movie_details_${id}`;
    const data = await fetchFromTMDB(
      `/movie/${id}`,
      { append_to_response: 'credits,videos' },
      cacheKey,
      60 * 60 * 1000
    );

    if (data) {
      const trailer = data.videos?.results?.find(
        (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
      );
      return formatMovieImages({
        ...data,
        trailerKey: trailer ? trailer.key : null,
        cast: data.credits?.cast?.slice(0, 10).map((c) => ({
          id: c.id,
          name: c.name,
          character: c.character,
          profile_path: c.profile_path,
          profile_url: c.profile_path ? `${TMDB_IMAGE_BASE_URL}/w185${c.profile_path}` : null,
        })) || [],
      });
    }

    // Fallback match
    const fallback = FALLBACK_MOVIES.find((m) => m.id === id) || FALLBACK_MOVIES[0];
    return formatMovieImages({
      ...fallback,
      id: fallback.id,
      cast: (fallback.cast || []).map((c) => ({
        ...c,
        profile_url: c.profile_path ? `${TMDB_IMAGE_BASE_URL}/w185${c.profile_path}` : null,
      })),
    });
  },

  // 9. Get Movie Genres
  async getGenres() {
    const cacheKey = 'genres_list';
    const data = await fetchFromTMDB('/genre/movie/list', {}, cacheKey, 24 * 60 * 60 * 1000);
    if (data && data.genres) {
      return data.genres;
    }
    return Object.entries(GENRE_MAP).map(([id, name]) => ({
      id: Number(id),
      name,
    }));
  },
};
