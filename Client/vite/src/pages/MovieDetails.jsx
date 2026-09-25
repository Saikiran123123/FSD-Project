import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { movieService, showService, reviewService } from '../services';
import { useBooking } from '../context/BookingContext';
import LoadingSpinner from '../components/LoadingSpinner';
import StarRating from '../components/StarRating';
import DemandIndicator from '../components/DemandIndicator';
import ReviewCard from '../components/ReviewCard';
import ReviewForm from '../components/ReviewForm';
import { formatINR } from '../utils/currency';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const showtimesRef = useRef(null);
  const { setSelectedMovie, setSelectedTheatre, setSelectedShow } = useBooking();

  const [movie, setMovie] = useState(null);
  const [theatresWithShows, setTheatresWithShows] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  // Generate 4 upcoming calendar dates
  const availableDates = [0, 1, 2, 3].map((offset) => {
    const d = new Date(Date.now() + offset * 86400000);
    return {
      dateStr: d.toISOString().split('T')[0],
      dayName: offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      formattedDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  });

  useEffect(() => {
    const loadMovieDetails = async () => {
      setLoading(true);
      try {
        const [movieRes, showsRes, revRes] = await Promise.all([
          movieService.getMovieDetails(id),
          showService.getShowsByMovie(id, selectedDate),
          reviewService.getReviews({ targetType: 'movie', tmdbMovieId: id }),
        ]);

        if (movieRes.data) {
          setMovie(movieRes.data);
        }
        if (showsRes.data) {
          setTheatresWithShows(showsRes.data);
        }
        if (revRes.data) {
          setReviews(revRes.data);
        }
      } catch (err) {
        console.error('Error fetching movie details:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMovieDetails();
  }, [id, selectedDate]);

  const handleSelectShow = (theatre, show) => {
    setSelectedMovie(movie);
    setSelectedTheatre(theatre);
    setSelectedShow(show);
    navigate(`/booking/seats/${show._id}`);
  };

  const handleReviewAdded = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  const scrollToBooking = () => {
    showtimesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return <LoadingSpinner text="Summoning movie presentation & showtimes..." />;
  }

  if (!movie) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-white p-6">
        <h2 className="text-xl font-bold">Movie not found</h2>
        <button
          onClick={() => navigate('/movies')}
          className="btn-cinema mt-4 px-6 py-2.5 rounded-xl text-xs font-bold"
        >
          Return to Movies
        </button>
      </div>
    );
  }

  const posterSrc =
    movie.poster_url ||
    (movie.poster_path
      ? (movie.poster_path.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`)
      : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80');

  const backdropSrc =
    movie.backdrop_url ||
    (movie.backdrop_path
      ? (movie.backdrop_path.startsWith('http') ? movie.backdrop_path : `https://image.tmdb.org/t/p/original${movie.backdrop_path}`)
      : posterSrc);

  return (
    <div className="movie-details-page min-h-screen bg-[#07070b] text-white">
      {/* 1. Backdrop Hero Banner */}
      <section className="relative min-h-[540px] lg:h-[68vh] flex items-end overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <img
            src={backdropSrc}
            alt={movie.title}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&auto=format&fit=crop&q=80';
            }}
            className="w-full h-full object-cover object-top filter brightness-[0.45]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07070b] via-[#07070b]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07070b] via-[#07070b]/80 to-transparent" />
        </div>

        <div className="relative z-10 container-cinema w-full py-12 flex flex-col md:flex-row items-center md:items-end gap-8 sm:gap-10">
          {/* Poster Box */}
          <div className="w-48 sm:w-56 shrink-0 aspect-[2/3] rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#10111a] group">
            <img
              src={posterSrc}
              alt={movie.title}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80';
              }}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Movie Metadata */}
          <div className="space-y-4 max-w-3xl pb-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge-spotlight">
                <span>{movie.certification || 'UA'}</span>
              </span>
              <span className="badge-rating">
                <span>★</span>
                <span>{Number(movie.vote_average || 8.0).toFixed(1)} / 10</span>
              </span>
              <span className="badge-format uppercase">
                <span>{movie.language_name || movie.original_language || 'Feature Film'}</span>
              </span>
              {movie.runtime && (
                <span className="bg-white/5 border border-white/10 text-zinc-300 text-xs px-3 py-1.5 rounded-full font-mono">
                  ⏱️ {movie.runtime} min
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-sm text-[#ffb703] italic font-medium">"{movie.tagline}"</p>
            )}

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {(movie.genres || []).map((g, idx) => (
                <span
                  key={idx}
                  className="bg-white/5 border border-white/10 text-zinc-300 text-xs px-3.5 py-1 rounded-full font-medium"
                >
                  {typeof g === 'string' ? g : g.name}
                </span>
              ))}
            </div>

            {/* Synopsis */}
            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
              {movie.overview}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                onClick={scrollToBooking}
                className="btn-cinema text-sm px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 shadow-xl cursor-pointer"
              >
                <span>🎟️</span>
                <span>Book Tickets</span>
              </button>

              <button
                onClick={() => setShowTrailerModal(true)}
                className="btn-secondary text-sm px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 cursor-pointer"
              >
                <span>▶</span>
                <span>Watch Trailer</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trailer Modal */}
      {showTrailerModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
            <button
              onClick={() => setShowTrailerModal(false)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white font-bold flex items-center justify-center cursor-pointer transition-colors"
            >
              ✕
            </button>
            <div className="aspect-video w-full">
              <iframe
                title={movie.title}
                src={`https://www.youtube-nocookie.com/embed/${movie.trailerKey || 'Way9Dexny3w'}?autoplay=1`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. Showtime & Multiplex Selection Area */}
      <section ref={showtimesRef} className="py-20 sm:py-24 container-cinema space-y-10">
        <div>
          <span className="text-[#e50914] text-xs font-bold uppercase tracking-[0.12em] block mb-2">
            ● RESERVE YOUR SHOW
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Available Showtimes & Screens
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 leading-relaxed">
            Select your preferred date, multiplex, and show format
          </p>
        </div>

        {/* Date Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {availableDates.map((item) => {
            const isSelected = selectedDate === item.dateStr;
            return (
              <button
                key={item.dateStr}
                onClick={() => setSelectedDate(item.dateStr)}
                className={`flex flex-col items-center min-w-[110px] p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#e50914] border-red-500 text-white shadow-lg shadow-red-600/30 scale-105'
                    : 'bg-white/[0.04] border-white/10 hover:border-white/20 text-zinc-400 hover:text-white backdrop-blur-md'
                }`}
              >
                <span className="text-[11px] font-bold uppercase tracking-wider">{item.dayName}</span>
                <span className="text-sm font-black text-white mt-0.5">{item.formattedDate}</span>
              </button>
            );
          })}
        </div>

        {/* Theatres & Shows List */}
        {theatresWithShows.length === 0 ? (
          <div className="text-center py-16 bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/5 space-y-2">
            <p className="text-3xl">🏛️</p>
            <h3 className="text-base font-bold text-white">No Shows Scheduled on this Date</h3>
            <p className="text-xs text-zinc-400">
              Please choose another date or check back later as new showtimes are populated daily.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {theatresWithShows.map((theatreItem) => (
              <div
                key={theatreItem.theatre._id}
                className="glass-card rounded-2xl p-6 sm:p-8 space-y-5"
              >
                {/* Theatre Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>{theatreItem.theatre.name}</span>
                      <span className="text-xs text-zinc-400 font-normal">({theatreItem.theatre.city})</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">{theatreItem.theatre.address}</p>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-zinc-300 font-medium">
                      ⚡ M-Ticket & F&B Available
                    </span>
                  </div>
                </div>

                {/* Showtimes Grid */}
                <div className="flex flex-wrap gap-3.5">
                  {theatreItem.shows.map((show) => (
                    <button
                      key={show._id}
                      onClick={() => handleSelectShow(theatreItem.theatre, show)}
                      className="group flex flex-col items-center justify-between p-3.5 min-w-[130px] rounded-xl bg-white/5 hover:bg-[#e50914] border border-white/10 hover:border-red-500 transition-all text-center cursor-pointer shadow-sm hover:shadow-lg hover:shadow-red-600/20"
                    >
                      <div className="text-sm font-black text-white group-hover:text-white">
                        {show.showTime}
                      </div>
                      <div className="text-[10px] text-zinc-400 group-hover:text-white/90 font-bold uppercase mt-0.5">
                        {show.screenSnapshot?.format || '2D'} • {show.screenSnapshot?.screenName || 'Screen 1'}
                      </div>
                      <div className="mt-2 text-xs font-mono font-bold text-[#00d4aa] group-hover:text-white">
                        {formatINR(show.basePrice || 220)}
                      </div>
                      <div className="mt-1.5">
                        <DemandIndicator occupancyPercentage={show.occupancyPercentage || 25} showLabel={false} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Ratings & Reviews Section */}
      <section className="py-20 sm:py-24 container-cinema border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Post a Review */}
          <div>
            <ReviewForm
              targetType="movie"
              tmdbMovieId={id}
              onReviewSubmitted={handleReviewAdded}
            />
          </div>

          {/* Right 2 Columns: Reviews List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                Guest Reviews ({reviews.length})
              </h3>
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                <span className="text-[#ffb703] text-xs">★</span>
                <span className="text-xs font-bold text-white">
                  {Number(movie.vote_average || 8.0).toFixed(1)} Community Rating
                </span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-white/[0.02] rounded-2xl border border-white/5">
                <p className="text-xs text-zinc-400">
                  Be the first verified guest to review {movie.title}!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <ReviewCard key={rev._id} review={rev} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MovieDetails;
