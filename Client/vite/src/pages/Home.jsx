import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { movieService, theatreService, offerService } from '../services';
import MovieCard from '../components/MovieCard';
import SectionHeader from '../components/ui/SectionHeader';
import { MovieCardSkeleton } from '../components/ui/Skeleton';
import { CURATED_MOVIES, CURATED_THEATRES } from '../data/curatedData';

const LANGUAGES = [
  { code: 'te', name: 'Telugu', label: 'Tollywood' },
  { code: 'hi', name: 'Hindi', label: 'Bollywood' },
  { code: 'ta', name: 'Tamil', label: 'Kollywood' },
  { code: 'ml', name: 'Malayalam', label: 'Mollywood' },
  { code: 'kn', name: 'Kannada', label: 'Sandalwood' },
  { code: 'en', name: 'English', label: 'Hollywood' },
  { code: 'mr', name: 'Marathi', label: 'Marathi' },
  { code: 'bn', name: 'Bengali', label: 'Bengali' },
];

const GENRES = [
  { name: 'Action', icon: '🔥' },
  { name: 'Comedy', icon: '😂' },
  { name: 'Thriller', icon: '⚡' },
  { name: 'Romance', icon: '❤️' },
  { name: 'Horror', icon: '👻' },
  { name: 'Drama', icon: '🎭' },
  { name: 'Adventure', icon: '🧭' },
  { name: 'Animation', icon: '✨' },
  { name: 'Family', icon: '🍿' },
  { name: 'Sci-Fi', icon: '🚀' },
];

const VALUE_PROPS = [
  {
    icon: '🎬',
    title: 'Multi-Language Discovery',
    description: 'Explore movies across Tollywood, Bollywood, Kollywood, Hollywood, and global cinema.',
  },
  {
    icon: '🎟️',
    title: 'Instant Showtime Booking',
    description: 'Select your preferred multiplex, date, format, and showtime with zero friction.',
  },
  {
    icon: '💺',
    title: 'Atomic 5-Min Seat Lock',
    description: 'Real-time interactive auditorium layouts ensure nobody takes your selected seats.',
  },
  {
    icon: '🍿',
    title: 'Gourmet Concessions & Pass',
    description: 'Pre-order food combos and breeze through entry turnstiles with your digital QR pass.',
  },
];

const CINEBOT_OPTIONS = ['Action', 'Comedy', 'Thriller', 'Horror', 'Family'];

const Home = () => {
  const navigate = useNavigate();

  // Core Data states
  const [nowPlaying, setNowPlaying] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Quick Booking Bar states
  const [bookingCity, setBookingCity] = useState('Hyderabad');
  const [bookingDate, setBookingDate] = useState('Today');
  const [bookingMovie, setBookingMovie] = useState('all');
  const [bookingLanguage, setBookingLanguage] = useState('all');

  // Interactive Language discovery states
  const [selectedLanguage, setSelectedLanguage] = useState('te');
  const [languageMoviesCache, setLanguageMoviesCache] = useState({});
  const [loadingLanguage, setLoadingLanguage] = useState(false);

  // Interactive Genre discovery states
  const [selectedGenre, setSelectedGenre] = useState('Action');
  const [genreMoviesCache, setGenreMoviesCache] = useState({});
  const [loadingGenre, setLoadingGenre] = useState(false);

  // Theatre search state
  const [theatreSearch, setTheatreSearch] = useState('');

  // Copy offer code feedback
  const [copiedCode, setCopiedCode] = useState('');

  // Initial Data Load
  useEffect(() => {
    let isMounted = true;

    const loadHomeData = async () => {
      setLoading(true);
      try {
        const [npResult, upResult, thResult, offResult, teResult, actionResult] = await Promise.allSettled([
          movieService.getNowPlaying(1, { region: 'IN' }),
          movieService.getUpcoming(1, { region: 'IN' }),
          theatreService.getTheatres('Hyderabad'),
          offerService.getActiveOffers(),
          movieService.getMoviesByLanguage('te', 1),
          movieService.discoverMovies({ genre: 'Action', sortBy: 'popularity.desc' }),
        ]);

        if (!isMounted) return;

        // Now Playing
        if (npResult.status === 'fulfilled' && npResult.value) {
          const npList = npResult.value.results || (Array.isArray(npResult.value) ? npResult.value : (npResult.value.data || []));
          if (npList.length > 0) {
            setNowPlaying(npList);
            setBookingMovie(npList[0].id.toString());
          }
        }

        // Upcoming
        if (upResult.status === 'fulfilled' && upResult.value) {
          const upList = upResult.value.results || (Array.isArray(upResult.value) ? upResult.value : (upResult.value.data || []));
          if (upList.length > 0) {
            setUpcoming(upList);
          }
        }

        // Theatres
        if (thResult.status === 'fulfilled' && thResult.value) {
          const thList = thResult.value.data || (Array.isArray(thResult.value) ? thResult.value : []);
          if (thList.length > 0) {
            setTheatres(thList);
          }
        }

        // Offers
        if (offResult.status === 'fulfilled' && offResult.value) {
          const offList = offResult.value.data || (Array.isArray(offResult.value) ? offResult.value : []);
          if (offList.length > 0) {
            setOffers(offList);
          }
        }

        // Language te
        if (teResult.status === 'fulfilled' && teResult.value) {
          const teList = teResult.value.results || (Array.isArray(teResult.value) ? teResult.value : []);
          if (teList.length > 0) {
            setLanguageMoviesCache((prev) => ({ ...prev, te: teList }));
          }
        }

        // Genre Action
        if (actionResult.status === 'fulfilled' && actionResult.value) {
          const actList = actionResult.value.results || (Array.isArray(actionResult.value) ? actionResult.value : []);
          if (actList.length > 0) {
            setGenreMoviesCache((prev) => ({ ...prev, Action: actList }));
          }
        }
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch theatres when city changes
  useEffect(() => {
    let isMounted = true;
    const fetchCityTheatres = async () => {
      try {
        const res = await theatreService.getTheatres(bookingCity);
        if (isMounted && res?.data && res.data.length > 0) {
          setTheatres(res.data);
        }
      } catch (err) {
        console.error('Error fetching city theatres:', err);
      }
    };
    fetchCityTheatres();
    return () => {
      isMounted = false;
    };
  }, [bookingCity]);

  // Fetch language movies on language switch
  const fetchMoviesForLanguage = useCallback(
    async (langCode) => {
      if (languageMoviesCache[langCode]?.length > 0) return;
      setLoadingLanguage(true);
      try {
        const res = await movieService.getMoviesByLanguage(langCode, 1);
        const list = res?.results || (Array.isArray(res) ? res : (res?.data || []));
        if (list.length > 0) {
          setLanguageMoviesCache((prev) => ({
            ...prev,
            [langCode]: list,
          }));
        } else {
          // Fallback to curated catalog by language
          const matchingCurated = CURATED_MOVIES.filter((m) => m.original_language === langCode);
          setLanguageMoviesCache((prev) => ({
            ...prev,
            [langCode]: matchingCurated.length > 0 ? matchingCurated : CURATED_MOVIES.slice(0, 6),
          }));
        }
      } catch (err) {
        console.error(`Error fetching movies for language ${langCode}:`, err);
        const matchingCurated = CURATED_MOVIES.filter((m) => m.original_language === langCode);
        setLanguageMoviesCache((prev) => ({
          ...prev,
          [langCode]: matchingCurated.length > 0 ? matchingCurated : CURATED_MOVIES.slice(0, 6),
        }));
      } finally {
        setLoadingLanguage(false);
      }
    },
    [languageMoviesCache]
  );

  useEffect(() => {
    fetchMoviesForLanguage(selectedLanguage);
  }, [selectedLanguage, fetchMoviesForLanguage]);

  // Fetch genre movies on genre switch
  const fetchMoviesForGenre = useCallback(
    async (genreName) => {
      if (genreMoviesCache[genreName]?.length > 0) return;
      setLoadingGenre(true);
      try {
        const res = await movieService.discoverMovies({ genre: genreName, sortBy: 'popularity.desc' });
        const list = res?.results || (Array.isArray(res) ? res : (res?.data || []));
        if (list.length > 0) {
          setGenreMoviesCache((prev) => ({
            ...prev,
            [genreName]: list,
          }));
        } else {
          const gLower = genreName.toLowerCase();
          const matchingCurated = CURATED_MOVIES.filter((m) =>
            m.genres?.some((g) => (typeof g === 'string' ? g : g.name).toLowerCase().includes(gLower))
          );
          setGenreMoviesCache((prev) => ({
            ...prev,
            [genreName]: matchingCurated.length > 0 ? matchingCurated : CURATED_MOVIES.slice(0, 6),
          }));
        }
      } catch (err) {
        console.error(`Error fetching movies for genre ${genreName}:`, err);
        const gLower = genreName.toLowerCase();
        const matchingCurated = CURATED_MOVIES.filter((m) =>
          m.genres?.some((g) => (typeof g === 'string' ? g : g.name).toLowerCase().includes(gLower))
        );
        setGenreMoviesCache((prev) => ({
          ...prev,
          [genreName]: matchingCurated.length > 0 ? matchingCurated : CURATED_MOVIES.slice(0, 6),
        }));
      } finally {
        setLoadingGenre(false);
      }
    },
    [genreMoviesCache]
  );

  useEffect(() => {
    fetchMoviesForGenre(selectedGenre);
  }, [selectedGenre, fetchMoviesForGenre]);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/movies');
    }
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (bookingMovie && bookingMovie !== 'all') {
      navigate(`/movie/${bookingMovie}`);
    } else if (bookingLanguage && bookingLanguage !== 'all') {
      navigate(`/movies?language=${bookingLanguage}`);
    } else {
      navigate('/movies');
    }
  };

  const handleAskCineBot = (genre = '') => {
    const prompt = genre
      ? `Recommend a top ${genre} movie playing in theatres tonight.`
      : 'I want a thrilling movie recommendation for tonight.';
    window.dispatchEvent(
      new CustomEvent('open-cinebot', {
        detail: { prompt },
      })
    );
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2500);
  };

  // Filter theatres for theatre section
  const cityCuratedTheatres = CURATED_THEATRES.filter((t) => t.city.toLowerCase() === bookingCity.toLowerCase());
  const availableTheatres = theatres.length > 0 ? theatres : (cityCuratedTheatres.length > 0 ? cityCuratedTheatres : CURATED_THEATRES);
  
  const filteredTheatres = availableTheatres.filter((t) => {
    if (!theatreSearch.trim()) return true;
    const q = theatreSearch.toLowerCase();
    return (
      t.name?.toLowerCase().includes(q) ||
      t.address?.toLowerCase().includes(q) ||
      t.area?.toLowerCase().includes(q) ||
      t.chain?.toLowerCase().includes(q) ||
      t.city?.toLowerCase().includes(q)
    );
  });

  const displayTheatres = filteredTheatres.length > 0 ? filteredTheatres : availableTheatres;

  // Effective datasets with safe fallbacks
  const displayNowPlaying = nowPlaying.length >= 6 ? nowPlaying : CURATED_MOVIES.filter((m) => m.status === 'now_playing');
  const displayUpcoming = upcoming.length >= 6 ? upcoming : CURATED_MOVIES.filter((m) => m.status === 'upcoming' || new Date(m.release_date) >= new Date('2024-09-01'));
  
  const currentLangMatching = CURATED_MOVIES.filter((m) => m.original_language === selectedLanguage);
  const displayLanguageMovies =
    languageMoviesCache[selectedLanguage]?.length > 0
      ? languageMoviesCache[selectedLanguage]
      : (currentLangMatching.length > 0 ? currentLangMatching : CURATED_MOVIES.slice(0, 6));

  const currentGenreMatching = CURATED_MOVIES.filter((m) =>
    m.genres?.some((g) => (typeof g === 'string' ? g : g.name).toLowerCase().includes(selectedGenre.toLowerCase()))
  );
  const displayGenreMovies =
    genreMoviesCache[selectedGenre]?.length > 0
      ? genreMoviesCache[selectedGenre]
      : (currentGenreMatching.length > 0 ? currentGenreMatching : CURATED_MOVIES.slice(0, 6));

  // Fallback offers if none loaded
  const displayOffers =
    offers.length > 0
      ? offers.slice(0, 3)
      : [
          {
            _id: '1',
            code: 'FIRST50',
            title: 'Movie Night Pass',
            description: 'Flat ₹50 OFF on your first cinema ticket reservation with CineBook.',
          },
          {
            _id: '2',
            code: 'CINEVIP',
            title: 'Weekend Laser Special',
            description: 'Complimentary popcorn combo voucher with any IMAX 3D Laser ticket.',
          },
          {
            _id: '3',
            code: 'WEEKEND20',
            title: 'Concession Discount',
            description: '20% discount on beverage and nachos pre-orders during checkout.',
          },
        ];

  return (
    <div className="home-page min-h-screen bg-[#07070b] text-white selection:bg-[#e50914] selection:text-white">
      {/* =========================================================================
          1. HERO & BOOKING SECTION (ONE COMPLETE SCREEN 85–90vh)
         ========================================================================= */}
      <section className="relative min-h-[calc(88vh)] lg:min-h-[calc(90vh)] flex flex-col justify-between pt-6 pb-8 lg:pt-8 lg:pb-10 overflow-hidden border-b border-white/[0.06]">
        {/* Subtle Atmospheric Cinema Lighting */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 right-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#e50914]/10 via-[#ffb703]/3 to-transparent blur-3xl" />
          <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950/20 to-transparent blur-3xl" />
          <div className="absolute inset-0 bg-[#07070b]/60" />
        </div>

        {/* Hero Main Content (Centered vertically in the main area) */}
        <div className="relative z-10 container-cinema w-full my-auto py-6 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left 55%: Brand Eyebrow, Heading, Description, Search Bar, Matching Action Buttons */}
            <div className="lg:col-span-7 space-y-0">
              {/* Editorial Eyebrow */}
              <div className="inline-flex items-center text-[12px] font-semibold tracking-[0.14em] text-zinc-300 uppercase mb-3.5 sm:mb-4">
                <span className="text-[#e50914] font-black mr-2 text-sm leading-none">•</span>
                <span>CINEBOOK</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[62px] xl:text-[68px] font-[800] tracking-tight leading-[1.02] text-white">
                YOUR MOVIE. <br />
                <span className="text-zinc-200">YOUR SEAT.</span> <br />
                <span className="text-[#e50914]">YOUR EXPERIENCE.</span>
              </h1>

              {/* Supporting Text */}
              <p className="mt-4 sm:mt-5 text-zinc-300 text-base sm:text-lg lg:text-[17.5px] leading-[1.6] max-w-[560px] font-normal">
                Discover movies across multiple languages, explore top multiplexes, and book your perfect seat — all in one seamless flow.
              </p>

              {/* Prominent Discovery Search Bar */}
              <form onSubmit={handleHeroSearch} className="mt-7 sm:mt-8 max-w-[620px] w-full">
                <div className="flex items-center h-[58px] bg-white/[0.05] hover:bg-white/[0.07] focus-within:bg-white/[0.07] border border-white/[0.12] focus-within:border-[#e50914]/60 rounded-2xl transition-all shadow-xl backdrop-blur-xl px-2">
                  <span className="text-zinc-400 pl-3 shrink-0 pointer-events-none select-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search movies, actors, languages, genres..."
                    className="w-full bg-transparent border-none outline-none text-[15px] font-normal text-white placeholder-zinc-400 px-3.5 h-full"
                  />
                  <button
                    type="submit"
                    className="h-[46px] px-6 rounded-xl bg-[#e50914] hover:bg-[#ff1f2d] text-white text-[14px] font-semibold flex items-center justify-center shrink-0 transition-all shadow-md shadow-red-600/20 cursor-pointer"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Matching Hero Action Buttons */}
              <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-3.5">
                <Link
                  to="/movies"
                  className="h-[50px] sm:h-[52px] px-7 rounded-xl bg-[#e50914] hover:bg-[#ff1f2d] text-white text-[14.5px] font-semibold shadow-lg shadow-red-600/20 inline-flex items-center justify-center gap-2.5 hover:-translate-y-0.5 transition-all"
                >
                  <svg className="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                    />
                  </svg>
                  <span>Browse Movies</span>
                </Link>

                <Link
                  to="/theatres"
                  className="h-[50px] sm:h-[52px] px-7 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 hover:border-white/30 text-white text-[14.5px] font-semibold inline-flex items-center justify-center gap-2.5 hover:-translate-y-0.5 transition-all"
                >
                  <svg className="w-4 h-4 text-zinc-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span>Find Theatres</span>
                </Link>
              </div>
            </div>

            {/* Right 45%: Premium Cinematic CineBook Brand Visual */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
              {/* Subtle Ambient Glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#e50914]/15 via-[#ffb703]/5 to-transparent rounded-[32px] filter blur-2xl opacity-60 pointer-events-none" />

              {/* Brand Visualization Container */}
              <div className="relative w-full max-w-[480px] xl:max-w-[510px] rounded-[24px] bg-[#0d0e18]/95 border border-white/12 shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-5 sm:p-6 space-y-4 backdrop-blur-2xl overflow-hidden">
                {/* Visual Header */}
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[13px] font-bold text-white uppercase tracking-wider block">
                      CINEBOOK EXPERIENCE
                    </span>
                    <span className="text-[10.5px] font-semibold text-zinc-400 uppercase tracking-widest block">
                      PREMIER CINEMA
                    </span>
                  </div>
                  <span className="bg-white/[0.06] border border-white/10 text-zinc-300 text-[11px] font-semibold px-2.5 py-0.5 rounded-lg">
                    Cinema Pass
                  </span>
                </div>

                {/* Curved Screen & Auditorium Seat Layout */}
                <div className="bg-[#080910] border border-white/[0.08] rounded-xl p-3.5 sm:p-4 space-y-3 shadow-inner">
                  {/* Screen Arc */}
                  <div className="flex flex-col items-center gap-1 pb-1">
                    <div className="w-full max-w-[220px] h-[3px] rounded-full bg-gradient-to-r from-transparent via-[#e50914] to-transparent shadow-[0_0_12px_rgba(229,9,20,0.9)]" />
                    <span className="text-[9.5px] font-semibold tracking-[0.22em] text-zinc-400 uppercase">
                      CURVED CINEMA SCREEN
                    </span>
                  </div>

                  {/* Clean Seating Grid */}
                  <div className="space-y-1.5 py-1 select-none">
                    {/* Row A */}
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-[9px] font-semibold text-zinc-500 w-3 text-center">A</span>
                      <div className="flex gap-1.5">
                        <span className="w-3.5 h-3 rounded-sm bg-white/20" />
                        <span className="w-3.5 h-3 rounded-sm bg-white/20" />
                        <span className="w-3.5 h-3 rounded-sm bg-white/10" />
                        <span className="w-3.5 h-3 rounded-sm bg-white/20" />
                      </div>
                      <span className="w-2" />
                      <div className="flex gap-1.5">
                        <span className="w-3.5 h-3 rounded-sm bg-white/20" />
                        <span className="w-3.5 h-3 rounded-sm bg-white/20" />
                        <span className="w-3.5 h-3 rounded-sm bg-white/10" />
                        <span className="w-3.5 h-3 rounded-sm bg-white/20" />
                      </div>
                    </div>

                    {/* Row B */}
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-[9px] font-semibold text-zinc-500 w-3 text-center">B</span>
                      <div className="flex gap-1.5">
                        <span className="w-3.5 h-3 rounded-sm bg-white/20" />
                        <span className="w-3.5 h-3 rounded-sm bg-white/20" />
                        <span className="w-3.5 h-3 rounded-sm bg-white/20" />
                        <span className="w-3.5 h-3 rounded-sm bg-white/20" />
                      </div>
                      <span className="w-2" />
                      <div className="flex gap-1.5">
                        <span className="w-3.5 h-3 rounded-sm bg-white/20" />
                        <span className="w-3.5 h-3 rounded-sm bg-white/20" />
                        <span className="w-3.5 h-3 rounded-sm bg-white/20" />
                        <span className="w-3.5 h-3 rounded-sm bg-white/20" />
                      </div>
                    </div>

                    {/* Row C - Selected */}
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-[9px] font-bold text-[#e50914] w-3 text-center">C</span>
                      <div className="flex gap-1.5">
                        <span className="w-3.5 h-3 rounded-sm bg-white/20" />
                        <span className="w-3.5 h-3 rounded-sm bg-white/20" />
                        <span className="w-3.5 h-3 rounded-sm bg-[#e50914] shadow-[0_0_8px_#e50914]" />
                        <span className="w-3.5 h-3 rounded-sm bg-[#e50914] shadow-[0_0_8px_#e50914]" />
                      </div>
                      <span className="w-2" />
                      <div className="flex gap-1.5">
                        <span className="w-3.5 h-3 rounded-sm bg-white/20" />
                        <span className="w-3.5 h-3 rounded-sm bg-white/20" />
                        <span className="w-3.5 h-3 rounded-sm bg-white/20" />
                        <span className="w-3.5 h-3 rounded-sm bg-white/10" />
                      </div>
                    </div>

                    {/* Row D - Premium */}
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-[9px] font-bold text-[#ffb703] w-3 text-center">D</span>
                      <div className="flex gap-2">
                        <span className="w-4.5 h-3 rounded-sm bg-[#ffb703]/40 border border-[#ffb703]/60" />
                        <span className="w-4.5 h-3 rounded-sm bg-[#ffb703]/40 border border-[#ffb703]/60" />
                      </div>
                      <span className="w-2" />
                      <div className="flex gap-2">
                        <span className="w-4.5 h-3 rounded-sm bg-[#ffb703]/40 border border-[#ffb703]/60" />
                        <span className="w-4.5 h-3 rounded-sm bg-[#ffb703]/40 border border-[#ffb703]/60" />
                      </div>
                    </div>
                  </div>

                  {/* Clean Legend */}
                  <div className="flex items-center justify-between pt-1.5 border-t border-white/[0.08] text-[11px]">
                    <div className="flex items-center gap-3.5 text-zinc-400">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-white/20" />
                        <span>Available</span>
                      </span>
                      <span className="flex items-center gap-1 text-white font-medium">
                        <span className="w-2 h-2 rounded-full bg-[#e50914]" />
                        <span>Selected</span>
                      </span>
                      <span className="flex items-center gap-1 text-zinc-300 font-medium">
                        <span className="w-2 h-2 rounded-full bg-[#ffb703]" />
                        <span>Premium</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Visual Cards */}
                <div className="grid grid-cols-2 gap-2.5 pt-0.5">
                  <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-2.5 space-y-0.5">
                    <span className="text-[9.5px] uppercase font-bold text-zinc-400 tracking-wider block">
                      YOUR SEAT
                    </span>
                    <span className="text-[13px] font-semibold text-white block truncate">
                      C12 • C13
                    </span>
                  </div>

                  <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-2.5 space-y-0.5">
                    <span className="text-[9.5px] uppercase font-bold text-zinc-400 tracking-wider block">
                      YOUR SHOW
                    </span>
                    <span className="text-[13px] font-semibold text-white block truncate">
                      EVENING
                    </span>
                  </div>
                </div>

                {/* Digital Pass Accent */}
                <div className="p-2 bg-black/40 rounded-xl border border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-1 opacity-70">
                    <div className="h-3.5 w-1 bg-white" />
                    <div className="h-3.5 w-0.5 bg-white" />
                    <div className="h-3.5 w-1.5 bg-white" />
                    <div className="h-3.5 w-0.5 bg-white" />
                    <div className="h-3.5 w-1 bg-white" />
                    <div className="h-3.5 w-2 bg-white" />
                    <div className="h-3.5 w-0.5 bg-white" />
                    <div className="h-3.5 w-1.5 bg-white" />
                  </div>
                  <span className="text-[10.5px] font-mono tracking-widest text-zinc-400 font-semibold">
                    CINEBOOK DIGITAL PASS
                  </span>
                </div>

                {/* Integrated Food & Combos Badge */}
                <div className="pt-0.5 flex items-center justify-between text-[11px] text-zinc-400 border-t border-white/[0.06]">
                  <span className="flex items-center gap-1.5 text-zinc-300 font-medium">
                    <span>🍿</span>
                    <span>Food & Combos</span>
                  </span>
                  <span className="text-zinc-500">
                    Pre-order for your show
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating "BOOK YOUR MOVIE" Bar at the bottom edge of the Hero Screen */}
        <div className="relative z-10 container-cinema w-full pt-4 pb-4">
          <div className="bg-[#10111a]/95 border border-white/12 backdrop-blur-2xl rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e50914]" />
                BOOK YOUR MOVIE
              </span>
              <span className="text-[11px] text-zinc-400 hidden sm:inline">
                Instant showtime finder
              </span>
            </div>

            <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
              {/* 📍 City */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  CITY
                </span>
                <select
                  value={bookingCity}
                  onChange={(e) => setBookingCity(e.target.value)}
                  className="w-full h-[46px] bg-[#181928] border border-white/10 text-white px-3.5 rounded-xl text-[14px] font-semibold outline-none cursor-pointer hover:border-white/20 transition-colors"
                >
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Delhi-NCR">Delhi-NCR</option>
                </select>
              </div>

              {/* 📅 Date */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  DATE
                </span>
                <select
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full h-[46px] bg-[#181928] border border-white/10 text-white px-3.5 rounded-xl text-[14px] font-semibold outline-none cursor-pointer hover:border-white/20 transition-colors"
                >
                  <option value="Today">Today</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="Weekend">This Weekend</option>
                </select>
              </div>

              {/* 🎬 Movie / Theatre */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  MOVIE / THEATRE
                </span>
                <select
                  value={bookingMovie}
                  onChange={(e) => setBookingMovie(e.target.value)}
                  className="w-full h-[46px] bg-[#181928] border border-white/10 text-white px-3.5 rounded-xl text-[14px] font-semibold outline-none cursor-pointer hover:border-white/20 transition-colors truncate"
                >
                  <option value="all">Choose Movie / Theatre</option>
                  {displayNowPlaying.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* 🌐 Language */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  LANGUAGE
                </span>
                <select
                  value={bookingLanguage}
                  onChange={(e) => setBookingLanguage(e.target.value)}
                  className="w-full h-[46px] bg-[#181928] border border-white/10 text-white px-3.5 rounded-xl text-[14px] font-semibold outline-none cursor-pointer hover:border-white/20 transition-colors"
                >
                  <option value="all">All Languages</option>
                  <option value="te">Telugu</option>
                  <option value="hi">Hindi</option>
                  <option value="ta">Tamil</option>
                  <option value="ml">Malayalam</option>
                  <option value="kn">Kannada</option>
                  <option value="en">English</option>
                </select>
              </div>

              {/* CTA Button */}
              <div className="pt-2 sm:pt-0">
                <button
                  type="submit"
                  className="w-full h-[46px] sm:h-[48px] rounded-xl bg-[#e50914] hover:bg-[#ff1f2d] text-white text-[14px] font-semibold flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 cursor-pointer transition-all"
                >
                  <span>FIND SHOWS</span>
                  <span>→</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. RECOMMENDED / NOW SHOWING (6 Cards Desktop)
         ========================================================================= */}
      <section className="py-14 sm:py-20 border-t border-white/[0.06]">
        <div className="container-cinema space-y-8">
          <SectionHeader
            tag="RECOMMENDED FOR YOU"
            tagColor="text-[#e50914]"
            title="NOW SHOWING"
            subtitle="Movies playing near you in premium auditoriums"
            actionLabel="SEE ALL MOVIES"
            actionLink="/movies"
          />

          {loading && nowPlaying.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <MovieCardSkeleton key={n} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5">
              {displayNowPlaying.slice(0, 6).map((movie) => (
                <MovieCard key={movie.id} movie={movie} theatres={displayTheatres} city={bookingCity} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          3. MOVIES BY LANGUAGE (Interactive Regional & Global Discovery)
         ========================================================================= */}
      <section className="py-14 sm:py-20 border-t border-white/[0.06]">
        <div className="container-cinema space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[#ffb703] text-xs font-black uppercase tracking-widest block">
                ● REGIONAL & GLOBAL CINEMA
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
                MOVIES BY LANGUAGE
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Explore movies across Telugu, Hindi, Tamil, Malayalam, Kannada, English, and more
              </p>
            </div>
            <Link
              to={`/movies?language=${selectedLanguage}`}
              className="text-xs sm:text-sm font-bold text-[#e50914] hover:text-[#ff1f2d] flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <span>View All {LANGUAGES.find((l) => l.code === selectedLanguage)?.name || 'Language'} Movies</span>
              <span>→</span>
            </Link>
          </div>

          {/* Interactive Language Selector Tabs */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {LANGUAGES.map((lang) => {
              const isActive = selectedLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`px-4 py-2.5 rounded-xl border text-center shrink-0 transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#e50914] border-[#e50914] text-white shadow-lg shadow-red-600/30'
                      : 'bg-[#10111a] border-white/10 hover:border-white/25 text-zinc-300 hover:text-white'
                  }`}
                >
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider block ${
                      isActive ? 'text-white/80' : 'text-zinc-500'
                    }`}
                  >
                    {lang.label}
                  </span>
                  <span className="text-sm font-bold block mt-0.5">{lang.name}</span>
                </button>
              );
            })}
          </div>

          {/* Movies Grid for Active Language */}
          {loadingLanguage && !languageMoviesCache[selectedLanguage] ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <MovieCardSkeleton key={n} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5">
              {displayLanguageMovies.slice(0, 6).map((movie) => (
                <MovieCard key={movie.id} movie={movie} theatres={displayTheatres} city={bookingCity} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          4. BROWSE BY GENRE (Interactive Mood & Category Selection)
         ========================================================================= */}
      <section className="py-14 sm:py-20 border-t border-white/[0.06]">
        <div className="container-cinema space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[#00d4aa] text-xs font-black uppercase tracking-widest block">
                ● MOOD & GENRE
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
                BROWSE BY GENRE
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Find top-rated movies matching your favorite genre and mood
              </p>
            </div>
            <Link
              to={`/movies?genre=${selectedGenre}`}
              className="text-xs sm:text-sm font-bold text-[#00d4aa] hover:text-[#33e2bc] flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <span>View All {selectedGenre} Movies</span>
              <span>→</span>
            </Link>
          </div>

          {/* Interactive Genre Selector Tabs */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {GENRES.map((g) => {
              const isActive = selectedGenre === g.name;
              return (
                <button
                  key={g.name}
                  onClick={() => setSelectedGenre(g.name)}
                  className={`px-4 py-2.5 rounded-xl border text-center shrink-0 transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#e50914] to-[#b80c14] border-[#e50914] text-white shadow-lg shadow-red-600/30'
                      : 'bg-[#10111a] border-white/10 hover:border-white/25 text-zinc-300 hover:text-white'
                  }`}
                >
                  <span className="text-lg leading-none">{g.icon}</span>
                  <span className="text-xs sm:text-sm font-bold block">{g.name}</span>
                </button>
              );
            })}
          </div>

          {/* Movies Grid for Active Genre */}
          {loadingGenre && !genreMoviesCache[selectedGenre] ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <MovieCardSkeleton key={n} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5">
              {displayGenreMovies.slice(0, 6).map((movie) => (
                <MovieCard key={movie.id} movie={movie} theatres={displayTheatres} city={bookingCity} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          5. FIND A THEATRE (BookMyShow / Fandango Style Discovery)
         ========================================================================= */}
      <section className="py-14 sm:py-20 border-t border-white/[0.06]">
        <div className="container-cinema space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[#ffb703] text-xs font-black uppercase tracking-widest block">
                ● CINEMA MULTIPLEXES
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
                FIND A THEATRE
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Explore premier multiplexes, IMAX laser projection, and luxury auditoriums near you.
              </p>
            </div>

            {/* City dropdown selector + Search in Theatre */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={bookingCity}
                onChange={(e) => setBookingCity(e.target.value)}
                className="bg-[#10111a] border border-white/15 px-3.5 py-2.5 rounded-xl text-xs font-bold text-white outline-none cursor-pointer hover:border-white/30 transition-colors"
              >
                <option value="Hyderabad">📍 Hyderabad</option>
                <option value="Bengaluru">📍 Bengaluru</option>
                <option value="Mumbai">📍 Mumbai</option>
                <option value="Chennai">📍 Chennai</option>
                <option value="Delhi-NCR">📍 Delhi-NCR</option>
              </select>

              <input
                type="text"
                value={theatreSearch}
                onChange={(e) => setTheatreSearch(e.target.value)}
                placeholder="Search cinemas or areas..."
                className="bg-[#10111a] border border-white/15 text-white placeholder-zinc-500 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-[#e50914] transition-colors w-full sm:w-56"
              />
            </div>
          </div>

          {/* Theatre Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {displayTheatres.slice(0, 4).map((th) => (
              <div
                key={th._id}
                className="bg-[#10111a] border border-white/10 hover:border-white/25 rounded-2xl p-5 space-y-3.5 transition-all duration-200 hover:-translate-y-1 shadow-lg flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#ffb703] font-bold uppercase tracking-wider block">
                      {th.chain || th.city || bookingCity}
                    </span>
                    {th.rating && (
                      <span className="text-[11px] font-bold text-zinc-300 flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg">
                        <span className="text-[#ffb703]">★</span>
                        <span>{Number(th.rating).toFixed(1)}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-black text-white leading-snug group-hover:text-[#e50914] transition-colors">
                    {th.name}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-2">
                    {th.address || (th.area ? `${th.area}, ${th.city}` : 'Premium multiplex auditorium complex')}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-white/[0.06]">
                  {/* Formats / Facilities */}
                  <div className="flex flex-wrap gap-1.5 text-[10px]">
                    {(th.facilities && th.facilities.length > 0
                      ? th.facilities.slice(0, 3)
                      : ['Dolby Atmos', '4K Laser', 'Recliner']
                    ).map((fac, idx) => (
                      <span
                        key={idx}
                        className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-zinc-300"
                      >
                        {fac}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/theatres?city=${encodeURIComponent(th.city || bookingCity)}`}
                    className="w-full btn-secondary text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1 text-center"
                  >
                    <span>VIEW SHOWTIMES</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. COMING SOON (Upcoming Movies)
         ========================================================================= */}
      <section className="py-14 sm:py-20 border-t border-white/[0.06]">
        <div className="container-cinema space-y-8">
          <SectionHeader
            tag="ANTICIPATED RELEASES"
            tagColor="text-[#ffb703]"
            title="COMING SOON"
            subtitle="Mark your calendar for what's coming to the big screen."
            actionLabel="SEE ALL UPCOMING"
            actionLink="/releases"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5">
            {displayUpcoming.slice(0, 6).map((movie) => (
              <MovieCard key={movie.id} movie={movie} isUpcoming={true} theatres={displayTheatres} city={bookingCity} />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. OFFERS (Movie Night Offers - Premium Voucher Passes)
         ========================================================================= */}
      <section className="py-14 sm:py-20 border-t border-white/[0.06]">
        <div className="container-cinema space-y-8 sm:space-y-10">
          <SectionHeader
            tag="EXCLUSIVE PRIVILEGES"
            tagColor="text-[#ffb703]"
            title="MOVIE NIGHT OFFERS"
            subtitle="Exclusive discounts, concession benefits, and promo codes for your next show."
            actionLabel="View All Offers"
            actionLink="/offers"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
            {displayOffers.map((offer) => (
              <div
                key={offer._id || offer.code}
                className="relative rounded-2xl bg-gradient-to-br from-[#121320] via-[#0f101a] to-[#090a12] border border-white/10 hover:border-[#ffb703]/50 p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-xl hover:-translate-y-1.5 transition-all duration-300 group overflow-hidden"
              >
                {/* Subtle Ambient Glow */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#ffb703]/12 to-transparent pointer-events-none" />

                <div className="space-y-3.5 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="bg-[#ffb703]/15 border border-[#ffb703]/30 text-[#ffb703] text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      {offer.badge || 'SPECIAL OFFER'}
                    </span>
                    <span className="text-zinc-400 text-xs font-mono tracking-wider font-semibold">CineBook Pass</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#ffb703] transition-colors">
                      {offer.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-zinc-300 leading-relaxed font-normal">
                      {offer.description}
                    </p>
                  </div>
                </div>

                {/* Voucher Ticket Dashed Divider & Action */}
                <div className="pt-4 border-t border-dashed border-white/15 flex items-center justify-between gap-3 relative z-10">
                  <div className="bg-black/70 border border-white/15 rounded-xl px-3.5 py-2 flex items-center gap-2 shadow-inner">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">CODE:</span>
                    <span className="font-mono font-black text-white text-sm tracking-wider">{offer.code}</span>
                  </div>

                  <button
                    onClick={() => handleCopyCode(offer.code)}
                    className={`text-xs font-bold px-4 py-2.5 rounded-xl border transition-all cursor-pointer shadow-md ${
                      copiedCode === offer.code
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-white/5 hover:bg-[#ffb703] border-white/15 hover:border-[#ffb703] text-zinc-200 hover:text-black'
                    }`}
                  >
                    {copiedCode === offer.code ? 'Copied! ✓' : 'Copy Code'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. WHY CINEBOOK? (Spacious Modern Feature Cards)
         ========================================================================= */}
      <section className="py-14 sm:py-20 border-t border-white/[0.06]">
        <div className="container-cinema space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2.5">
            <span className="text-[#e50914] text-xs font-black uppercase tracking-[0.2em] block">
              • THE CINEBOOK PROMISE
            </span>
            <h2 className="text-3xl sm:text-4xl font-[800] text-white tracking-tight">
              WHY CINEBOOK?
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Built for moviegoers. Engineered for fast, reliable, and premium cinema ticket booking.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUE_PROPS.map((v, i) => (
              <div
                key={i}
                className="bg-gradient-to-b from-[#11121e] to-[#0a0a10] border border-white/10 hover:border-white/25 rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl hover:-translate-y-1.5 transition-all duration-300 group"
              >
                <div className="w-13 h-13 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-[#e50914]/15 group-hover:border-[#e50914]/30 transition-all duration-300 shadow-inner">
                  {v.icon}
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#e50914] transition-colors">
                    {v.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-zinc-400 leading-relaxed font-normal">
                    {v.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. CINEBOT (Not Sure What to Watch? - AI Concierge Lounge)
         ========================================================================= */}
      <section className="py-14 sm:py-20 border-t border-white/[0.06]">
        <div className="container-cinema">
          <div className="relative rounded-[28px] bg-gradient-to-r from-[#121325] via-[#10111e] to-[#181126] border border-white/12 p-7 sm:p-10 lg:p-12 overflow-hidden shadow-2xl">
            {/* Atmospheric Ambient Glows */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-[#e50914]/10 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-10 w-80 h-80 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#ffb703]/8 to-transparent blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-[#ffb703] text-xs font-black uppercase tracking-[0.16em]">
                  <span className="w-2 h-2 rounded-full bg-[#ffb703] animate-pulse" />
                  <span>AI CONCIERGE</span>
                </div>

                <div className="space-y-1.5">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-[800] text-white tracking-tight">
                    NOT SURE WHAT TO WATCH?
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl">
                    Tell CineBot what mood you&apos;re in and get instant smart movie recommendations tailored to your taste.
                  </p>
                </div>

                {/* Interactive Quick Prompts */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mr-1">Quick Moods:</span>
                  {CINEBOT_OPTIONS.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => handleAskCineBot(genre)}
                      className="bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/25 text-xs font-semibold text-zinc-200 hover:text-white px-3.5 py-1.5 rounded-xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                    >
                      {genre === 'Action' && '🔥 '}
                      {genre === 'Comedy' && '😂 '}
                      {genre === 'Thriller' && '⚡ '}
                      {genre === 'Horror' && '👻 '}
                      {genre === 'Family' && '🍿 '}
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              <div className="shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => handleAskCineBot()}
                  className="w-full sm:w-auto h-[52px] px-8 rounded-2xl bg-gradient-to-r from-[#e50914] to-[#ff2b37] hover:from-[#ff1f2d] hover:to-[#e50914] text-white text-sm font-black shadow-xl shadow-red-600/30 flex items-center justify-center gap-2.5 cursor-pointer hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span className="text-lg">🤖</span>
                  <span>ASK CINEBOT AI</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
