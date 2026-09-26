import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { movieService } from '../services';
import MovieCard from '../components/MovieCard';
import SectionHeader from '../components/ui/SectionHeader';
import { MovieCardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

const MAJOR_INDIAN_LANGUAGES = [
  { code: 'all', label: 'All' },
  { code: 'te', label: 'Telugu' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ta', label: 'Tamil' },
  { code: 'ml', label: 'Malayalam' },
  { code: 'kn', label: 'Kannada' },
  { code: 'en', label: 'English' },
];

const ALL_LANGUAGES_LIST = [
  { code: 'all', label: 'All Languages' },
  { code: 'te', label: 'Telugu' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ta', label: 'Tamil' },
  { code: 'ml', label: 'Malayalam' },
  { code: 'kn', label: 'Kannada' },
  { code: 'en', label: 'English' },
  { code: 'mr', label: 'Marathi' },
  { code: 'bn', label: 'Bengali' },
  { code: 'pa', label: 'Punjabi' },
  { code: 'gu', label: 'Gujarati' },
  { code: 'or', label: 'Odia' },
  { code: 'as', label: 'Assamese' },
  { code: 'ko', label: 'Korean' },
  { code: 'ja', label: 'Japanese' },
  { code: 'zh', label: 'Chinese' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
];

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Top Rated' },
  { value: 'primary_release_date.desc', label: 'Newest Releases' },
];

const YEARS = ['All', '2026', '2025', '2024', '2023', '2022', '2021', '2020'];

const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read state from URL search params
  const urlQuery = searchParams.get('search') || '';
  const urlLanguage = searchParams.get('language') || 'all';
  const urlGenre = searchParams.get('genre') || 'All';
  const urlYear = searchParams.get('year') || 'All';
  const urlSort = searchParams.get('sortBy') || 'popularity.desc';
  const urlTab = searchParams.get('tab') || 'discover'; // 'discover' | 'now_playing' | 'upcoming' | 'top_rated'

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Search input state
  const [searchInput, setSearchInput] = useState(urlQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef(null);

  // Curated Language Carousels data for the multi-language discovery row
  const [languageShowcases, setLanguageShowcases] = useState({
    te: [],
    hi: [],
    ta: [],
    ml: [],
    kn: [],
  });
  const [showLanguageSections, setShowLanguageSections] = useState(true);

  // Fetch TMDB Genres once on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await movieService.getGenres();
        if (res.data) {
          setGenres(res.data);
        }
      } catch (err) {
        console.error('Error fetching genres:', err);
      }
    };
    fetchGenres();
  }, []);

  // Update URL helper
  const updateFilters = useCallback(
    (updates) => {
      const newParams = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (!value || value === 'all' || value === 'All' || (key === 'sortBy' && value === 'popularity.desc')) {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      });
      setSearchParams(newParams);
      setPage(1);
    },
    [searchParams, setSearchParams]
  );

  // Main movie fetcher function
  const fetchMovieList = useCallback(
    async (targetPage = 1, append = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        let res;

        if (urlQuery.trim()) {
          // Live search mode
          res = await movieService.searchMovies(urlQuery, targetPage, {
            language: urlLanguage !== 'all' ? urlLanguage : '',
            year: urlYear !== 'All' ? urlYear : '',
          });
        } else if (urlTab === 'now_playing' && urlLanguage === 'all' && urlGenre === 'All' && urlYear === 'All') {
          res = await movieService.getNowPlaying(targetPage, { region: 'IN' });
        } else if (urlTab === 'upcoming' && urlLanguage === 'all' && urlGenre === 'All' && urlYear === 'All') {
          res = await movieService.getUpcoming(targetPage, { region: 'IN' });
        } else if (urlTab === 'top_rated' && urlLanguage === 'all' && urlGenre === 'All' && urlYear === 'All') {
          res = await movieService.getTopRated(targetPage);
        } else {
          // Discover with multi-language & multi-attribute filter parameters
          let genreId = '';
          if (urlGenre !== 'All') {
            const matchedGenre = genres.find((g) => g.name.toLowerCase() === urlGenre.toLowerCase());
            if (matchedGenre) genreId = matchedGenre.id;
          }

          res = await movieService.discoverMovies({
            page: targetPage,
            language: urlLanguage !== 'all' ? urlLanguage : '',
            genre: genreId,
            year: urlYear !== 'All' ? urlYear : '',
            sortBy: urlSort,
            region: urlLanguage === 'all' ? 'IN' : '',
          });
        }

        if (res && res.results) {
          if (append) {
            setMovies((prev) => [...prev, ...res.results]);
          } else {
            setMovies(res.results);
          }
          setTotalPages(res.total_pages || 1);
          setTotalResults(res.total_results || res.results.length);
        }
      } catch (err) {
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [urlQuery, urlLanguage, urlGenre, urlYear, urlSort, urlTab, genres]
  );

  // Trigger main fetch when filters change
  useEffect(() => {
    fetchMovieList(1, false);
    setPage(1);

    // Only show multi-language showcase sections if on default 'All' discovery mode without active search/genres
    const isDefaultDiscovery = !urlQuery && urlLanguage === 'all' && urlGenre === 'All' && urlYear === 'All' && urlTab === 'discover';
    setShowLanguageSections(isDefaultDiscovery);
  }, [urlQuery, urlLanguage, urlGenre, urlYear, urlSort, urlTab, genres, fetchMovieList]);

  // Load showcase samples for Indian languages (Telugu, Hindi, Tamil, Malayalam, Kannada) on initial render
  useEffect(() => {
    if (!showLanguageSections) return;

    const loadShowcases = async () => {
      try {
        const [teRes, hiRes, taRes, mlRes, knRes] = await Promise.all([
          movieService.getMoviesByLanguage('te', 1),
          movieService.getMoviesByLanguage('hi', 1),
          movieService.getMoviesByLanguage('ta', 1),
          movieService.getMoviesByLanguage('ml', 1),
          movieService.getMoviesByLanguage('kn', 1),
        ]);

        setLanguageShowcases({
          te: (teRes.results || []).slice(0, 4),
          hi: (hiRes.results || []).slice(0, 4),
          ta: (taRes.results || []).slice(0, 4),
          ml: (mlRes.results || []).slice(0, 4),
          kn: (knRes.results || []).slice(0, 4),
        });
      } catch (err) {
        console.error('Error fetching language showcases:', err);
      }
    };

    loadShowcases();
  }, [showLanguageSections]);

  // Debounced search suggestion dropdown
  useEffect(() => {
    if (!searchInput.trim() || searchInput.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await movieService.searchMovies(searchInput, 1);
        if (res.results) {
          setSuggestions(res.results.slice(0, 5));
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error('Suggestion search error:', err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Close suggestion dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    setShowSuggestions(false);
    updateFilters({ search: searchInput.trim() });
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSuggestions([]);
    setShowSuggestions(false);
    updateFilters({ search: '' });
  };

  const handleClearAllFilters = () => {
    setSearchInput('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSearchParams(new URLSearchParams());
    setPage(1);
  };

  const handleLoadMore = () => {
    if (page < totalPages && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovieList(nextPage, true);
    }
  };

  const getLanguageLabel = (code) => {
    const found = ALL_LANGUAGES_LIST.find((l) => l.code === code);
    return found ? found.label : code.toUpperCase();
  };

  const hasActiveFilters =
    urlQuery || urlLanguage !== 'all' || urlGenre !== 'All' || urlYear !== 'All' || urlSort !== 'popularity.desc';

  return (
    <div className="movies-page min-h-screen py-10 sm:py-14 text-white">
      <div className="container-cinema space-y-10">
        {/* Top Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#e50914]/10 border border-[#e50914]/30 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest text-[#e50914]">
            <span className="w-2 h-2 rounded-full bg-[#e50914] animate-pulse" />
            <span>Cinema Catalog & Discovery</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
            MOVIES
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Discover blockbuster cinema from Telugu, Hindi, Tamil, Malayalam, Kannada, English, and international screens.
          </p>
        </div>

        {/* Search Bar with Glassmorphism & Suggestions */}
        <div ref={searchContainerRef} className="max-w-3xl mx-auto relative z-30">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <div className="relative w-full">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg text-zinc-400 pointer-events-none">
                🔍
              </span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Search movies, actors, titles (e.g. Pushpa, Avatar, RRR, Kalki)..."
                className="w-full bg-white/[0.05] border border-white/15 focus:border-[#e50914] rounded-2xl pl-13 pr-32 py-4 text-sm font-medium text-white placeholder-zinc-500 outline-none backdrop-blur-xl shadow-2xl transition-all"
                style={{ height: '56px' }}
              />

              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-24 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs font-bold px-2 py-1 cursor-pointer transition-colors"
                >
                  ✕
                </button>
              )}

              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 btn-cinema text-xs font-black px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-lg cursor-pointer"
              >
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#10111f]/95 border border-white/15 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-2xl divide-y divide-white/5 z-50">
              {suggestions.map((item) => (
                <Link
                  key={item.id}
                  to={`/movie/${item.id}`}
                  onClick={() => setShowSuggestions(false)}
                  className="flex items-center gap-3.5 p-3 hover:bg-white/10 transition-colors"
                >
                  <div className="w-10 h-14 rounded-lg overflow-hidden bg-[#181928] shrink-0 border border-white/10">
                    <img src={item.poster_url} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">{item.title}</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-2">
                      <span className="font-mono text-[#ffb703]">{item.vote_average > 0 ? `★ ${Number(item.vote_average).toFixed(1)}` : 'New'}</span>
                      <span>•</span>
                      <span className="text-[#00d4aa] font-bold uppercase">{item.language_name || item.original_language}</span>
                      <span>•</span>
                      <span>{item.release_date ? new Date(item.release_date).getFullYear() : '2024'}</span>
                    </p>
                  </div>
                  <span className="text-zinc-500 text-xs pr-2">→</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Indian Language Access Buttons */}
        <div className="flex items-center justify-center flex-wrap gap-2 pt-1 pb-1">
          {MAJOR_INDIAN_LANGUAGES.map((lang) => {
            const isActive = urlLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => updateFilters({ language: lang.code })}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#e50914] to-[#b80610] text-white shadow-lg shadow-red-950/60 border border-red-500/40 scale-105'
                    : 'bg-white/[0.04] border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                {lang.label}
              </button>
            );
          })}

          {/* More Languages Dropdown Selector */}
          <div className="relative inline-block">
            <select
              value={urlLanguage}
              onChange={(e) => updateFilters({ language: e.target.value })}
              className="bg-[#12131f] border border-white/15 hover:border-white/30 text-zinc-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold outline-none cursor-pointer appearance-none pr-8 transition-colors"
            >
              <option value="all" className="bg-[#0f101b] text-white">
                More Languages...
              </option>
              {ALL_LANGUAGES_LIST.slice(7).map((l) => (
                <option key={l.code} value={l.code} className="bg-[#0f101b] text-white">
                  {l.label}
                </option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-zinc-400">
              ▼
            </span>
          </div>
        </div>

        {/* Discovery Filter Bar (Language, Genre, Year, Sort, Reset) */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Language Filter */}
            <div className="relative">
              <select
                value={urlLanguage}
                onChange={(e) => updateFilters({ language: e.target.value })}
                className="bg-[#181928] border border-white/15 text-white px-3.5 py-2 rounded-xl text-xs font-bold outline-none cursor-pointer pr-7 transition-colors hover:border-white/30"
              >
                {ALL_LANGUAGES_LIST.map((l) => (
                  <option key={l.code} value={l.code} className="bg-[#0f101b] text-white">
                    {l.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[9px] text-zinc-400">
                ▼
              </span>
            </div>

            {/* Genre Filter */}
            <div className="relative">
              <select
                value={urlGenre}
                onChange={(e) => updateFilters({ genre: e.target.value })}
                className="bg-[#181928] border border-white/15 text-white px-3.5 py-2 rounded-xl text-xs font-bold outline-none cursor-pointer pr-7 transition-colors hover:border-white/30"
              >
                <option value="All" className="bg-[#0f101b] text-white">
                  All Genres
                </option>
                {genres.map((g) => (
                  <option key={g.id} value={g.name} className="bg-[#0f101b] text-white">
                    {g.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[9px] text-zinc-400">
                ▼
              </span>
            </div>

            {/* Year Filter */}
            <div className="relative">
              <select
                value={urlYear}
                onChange={(e) => updateFilters({ year: e.target.value })}
                className="bg-[#181928] border border-white/15 text-white px-3.5 py-2 rounded-xl text-xs font-bold outline-none cursor-pointer pr-7 transition-colors hover:border-white/30"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y} className="bg-[#0f101b] text-white">
                    {y === 'All' ? 'All Years' : y}
                  </option>
                ))}
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[9px] text-zinc-400">
                ▼
              </span>
            </div>

            {/* Sort Filter */}
            <div className="relative">
              <select
                value={urlSort}
                onChange={(e) => updateFilters({ sortBy: e.target.value })}
                className="bg-[#181928] border border-white/15 text-white px-3.5 py-2 rounded-xl text-xs font-bold outline-none cursor-pointer pr-7 transition-colors hover:border-white/30"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value} className="bg-[#0f101b] text-white">
                    {s.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[9px] text-zinc-400">
                ▼
              </span>
            </div>
          </div>

          {/* Clear Filters CTA */}
          {hasActiveFilters && (
            <button
              onClick={handleClearAllFilters}
              className="text-xs font-bold text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 cursor-pointer transition-colors"
            >
              Clear All Filters ✕
            </button>
          )}
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex items-center flex-wrap gap-2 text-xs">
            <span className="text-zinc-500 font-bold uppercase tracking-wider text-[11px]">Active Filters:</span>

            {urlQuery && (
              <span className="bg-[#e50914]/20 border border-[#e50914]/40 text-white px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
                <span>Search: &ldquo;{urlQuery}&rdquo;</span>
                <button onClick={handleClearSearch} className="cursor-pointer hover:text-zinc-300">
                  ✕
                </button>
              </span>
            )}

            {urlLanguage !== 'all' && (
              <span className="bg-white/10 border border-white/20 text-white px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
                <span>Language: {getLanguageLabel(urlLanguage)}</span>
                <button onClick={() => updateFilters({ language: 'all' })} className="cursor-pointer hover:text-zinc-300">
                  ✕
                </button>
              </span>
            )}

            {urlGenre !== 'All' && (
              <span className="bg-white/10 border border-white/20 text-white px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
                <span>Genre: {urlGenre}</span>
                <button onClick={() => updateFilters({ genre: 'All' })} className="cursor-pointer hover:text-zinc-300">
                  ✕
                </button>
              </span>
            )}

            {urlYear !== 'All' && (
              <span className="bg-white/10 border border-white/20 text-white px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
                <span>Year: {urlYear}</span>
                <button onClick={() => updateFilters({ year: 'All' })} className="cursor-pointer hover:text-zinc-300">
                  ✕
                </button>
              </span>
            )}

            {urlSort !== 'popularity.desc' && (
              <span className="bg-white/10 border border-white/20 text-white px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
                <span>Sort: {SORT_OPTIONS.find((s) => s.value === urlSort)?.label}</span>
                <button onClick={() => updateFilters({ sortBy: 'popularity.desc' })} className="cursor-pointer hover:text-zinc-300">
                  ✕
                </button>
              </span>
            )}
          </div>
        )}

        {/* Section Heading with Results Count */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {urlQuery
                ? `Search Results for "${urlQuery}"`
                : urlLanguage !== 'all'
                ? `${getLanguageLabel(urlLanguage)} Movies`
                : 'All Movies & Premieres'}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {totalResults > 0 ? `Showing ${movies.length} of ${totalResults} titles` : 'Exploring movie catalog...'}
            </p>
          </div>
        </div>

        {/* Main Movie Grid / Skeletons / Empty State */}
        {loading && movies.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6 pt-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <MovieCardSkeleton key={n} />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="pt-8">
            <EmptyState
              icon="🎬"
              title="No Movies Found"
              description={`No movies found for '${urlQuery || getLanguageLabel(urlLanguage)}'. Try another title, actor, or language filter.`}
              actionLabel="Clear All Filters"
              onAction={handleClearAllFilters}
            />
          </div>
        ) : (
          <div className="space-y-12">
            {/* Primary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Load More Button */}
            {page < totalPages && (
              <div className="text-center pt-4">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="btn-secondary px-8 py-3.5 rounded-2xl text-xs font-black border border-white/15 hover:border-white/30 text-white cursor-pointer transition-all shadow-xl disabled:opacity-50"
                >
                  {loadingMore ? 'Loading More Movies...' : 'Load More Movies ↓'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Multi-Language Discovery Carousels (Rendered when viewing default discovery) */}
        {showLanguageSections && !hasActiveFilters && (
          <div className="space-y-14 pt-12 border-t border-white/10">
            {/* Telugu Cinema */}
            {languageShowcases.te.length > 0 && (
              <div className="space-y-5">
                <SectionHeader
                  eyebrow="Tollywood • Telugu"
                  title="Telugu Blockbusters"
                  subtitle="Latest Telugu hits, mass entertainers, and action spectacles"
                  actionText="View All Telugu →"
                  actionLink="/movies?language=te"
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
                  {languageShowcases.te.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </div>
            )}

            {/* Hindi Cinema */}
            {languageShowcases.hi.length > 0 && (
              <div className="space-y-5">
                <SectionHeader
                  eyebrow="Bollywood • Hindi"
                  title="Hindi Premieres"
                  subtitle="Top Hindi blockbusters, drama spectacles, and comedy entertainers"
                  actionText="View All Hindi →"
                  actionLink="/movies?language=hi"
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
                  {languageShowcases.hi.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </div>
            )}

            {/* Tamil Cinema */}
            {languageShowcases.ta.length > 0 && (
              <div className="space-y-5">
                <SectionHeader
                  eyebrow="Kollywood • Tamil"
                  title="Tamil Cinematic Releases"
                  subtitle="Critically acclaimed Tamil movies, thrillers, and action extravaganzas"
                  actionText="View All Tamil →"
                  actionLink="/movies?language=ta"
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
                  {languageShowcases.ta.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </div>
            )}

            {/* Malayalam Cinema */}
            {languageShowcases.ml.length > 0 && (
              <div className="space-y-5">
                <SectionHeader
                  eyebrow="Mollywood • Malayalam"
                  title="Malayalam Highlights"
                  subtitle="World-class Malayalam storytelling, mystery thrillers, and realism"
                  actionText="View All Malayalam →"
                  actionLink="/movies?language=ml"
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
                  {languageShowcases.ml.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </div>
            )}

            {/* Kannada Cinema */}
            {languageShowcases.kn.length > 0 && (
              <div className="space-y-5">
                <SectionHeader
                  eyebrow="Sandalwood • Kannada"
                  title="Kannada Blockbusters"
                  subtitle="Epic Kannada sagas, high-concept thrillers, and folk dramas"
                  actionText="View All Kannada →"
                  actionLink="/movies?language=kn"
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
                  {languageShowcases.kn.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;
