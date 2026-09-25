import React from 'react';
import { Link } from 'react-router-dom';

const LANGUAGE_LABELS = {
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
};

const GENRE_MAP = {
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
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

const DEFAULT_POSTER = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80';

const MovieCard = ({ movie, isUpcoming = false, theatres = [], city = 'Hyderabad' }) => {
  if (!movie) return null;

  const posterSrc =
    movie.poster_url ||
    (movie.poster_path
      ? (movie.poster_path.startsWith('http')
          ? movie.poster_path
          : `https://image.tmdb.org/t/p/w500${movie.poster_path}`)
      : DEFAULT_POSTER);

  // Safely extract genres from movie.genres or movie.genre_ids
  let genresList = [];
  if (Array.isArray(movie.genres) && movie.genres.length > 0) {
    genresList = movie.genres
      .map((g) => {
        if (typeof g === 'string') return g;
        if (g && typeof g === 'object') return g.name || GENRE_MAP[g.id] || '';
        return '';
      })
      .filter(Boolean)
      .slice(0, 2);
  } else if (Array.isArray(movie.genre_ids) && movie.genre_ids.length > 0) {
    genresList = movie.genre_ids
      .map((id) => GENRE_MAP[id] || '')
      .filter(Boolean)
      .slice(0, 2);
  }

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  const langCode = (movie.original_language || 'en').toLowerCase();
  const langDisplay = (movie.language_name || LANGUAGE_LABELS[langCode] || langCode).toUpperCase();

  // Resolve screening theatre for this movie card
  let theatreDisplay = 'CineBook Multiplexes';
  if (Array.isArray(theatres) && theatres.length > 0) {
    const thIndex = Math.abs(Number(movie.id) || 0) % theatres.length;
    const th = theatres[thIndex];
    theatreDisplay = th.name ? th.name.replace('CineBook ', '') : (th.area || 'Multiplex');
  } else if (city) {
    theatreDisplay = `${city} Multiplexes`;
  }

  return (
    <div className="glass-card p-3 flex flex-col h-full group hover:border-[#e50914]/40 hover:-translate-y-1.5 transition-all duration-300 select-none rounded-[20px]">
      {/* Poster Container with 2/3 Aspect Ratio */}
      <div className="relative overflow-hidden rounded-[16px] bg-[#0e0f18] aspect-[2/3] w-full">
        <img
          src={posterSrc}
          alt={movie.title || 'Movie Poster'}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = DEFAULT_POSTER;
          }}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Ambient Poster Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

        {/* Top Badges: Rating Left, Language Right */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10 gap-1.5">
          {movie.vote_average > 0 ? (
            <div className="bg-black/75 backdrop-blur-md border border-white/20 px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-lg">
              <span className="text-[#ffb703] text-xs">★</span>
              <span className="text-white text-xs font-black">{Number(movie.vote_average).toFixed(1)}</span>
            </div>
          ) : (
            <span className="bg-[#e50914] text-white text-[10px] font-black px-2.5 py-0.5 rounded-lg shadow-md">
              {isUpcoming ? 'PREMIERE' : 'NEW'}
            </span>
          )}

          <div className="flex items-center gap-1">
            <span className="bg-black/75 backdrop-blur-md text-[10px] text-zinc-200 font-extrabold px-2.5 py-0.5 rounded-lg border border-white/20 uppercase tracking-wide shadow-md">
              {langDisplay}
            </span>
          </div>
        </div>

        {/* Cinematic Hover Overlay with Synopsis, Theatres & Quick CTA */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3.5 flex flex-col justify-end z-20">
          <p className="text-zinc-300 text-[11.5px] line-clamp-2 mb-2 leading-relaxed drop-shadow">
            {movie.overview || 'Experience the ultimate cinematic spectacle in premium sound and laser projection.'}
          </p>

          {/* Screening Theatres Highlight on Hover */}
          <div className="bg-white/10 border border-white/15 rounded-lg px-2 py-1 mb-2.5 flex items-center gap-1.5 text-[10.5px] text-zinc-200 backdrop-blur-md">
            <span className="text-[#ffb703]">📍</span>
            <span className="truncate font-semibold">{theatreDisplay}</span>
          </div>

          <Link
            to={`/movie/${movie.id}`}
            className="w-full text-center btn-cinema py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-xl transition-all"
          >
            <span>{isUpcoming ? 'View Details' : 'Book Tickets'}</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* Movie Information Footer */}
      <div className="pt-3 pb-0.5 px-0.5 flex flex-col justify-between flex-1 gap-1.5">
        <div>
          <Link to={`/movie/${movie.id}`}>
            <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1 group-hover:text-[#e50914] transition-colors">
              {movie.title || movie.original_title || 'Untitled Movie'}
            </h3>
          </Link>
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium mt-0.5">
            <span className="truncate">{genresList.join(' • ') || 'Feature Film'}</span>
            {releaseYear && <span className="font-mono text-zinc-500 font-semibold ml-2 shrink-0">{releaseYear}</span>}
          </div>
        </div>

        {/* Theatre Location Chip right below the movie card */}
        <div className="flex items-center justify-between text-[11px] text-zinc-300 pt-1.5 border-t border-white/[0.08]">
          <span className="flex items-center gap-1 text-zinc-300 truncate font-medium">
            <span className="text-[#ffb703] text-xs">📍</span>
            <span className="truncate">{theatreDisplay}</span>
          </span>
          <span className="text-[10px] text-[#00d4aa] font-bold bg-[#00d4aa]/10 border border-[#00d4aa]/20 px-1.5 py-0.5 rounded shrink-0">
            {isUpcoming ? 'SOON' : 'SHOWS'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
