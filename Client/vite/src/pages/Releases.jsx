import React, { useState, useEffect } from 'react';
import { movieService } from '../services';
import MovieCard from '../components/MovieCard';
import { MovieCardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

const Releases = () => {
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcoming = async () => {
      setLoading(true);
      try {
        const res = await movieService.getUpcoming(1);
        if (res.results) {
          setUpcomingMovies(res.results);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, []);

  return (
    <div className="releases-page min-h-screen bg-[#07070b] text-white py-16 sm:py-20">
      <div className="container-cinema space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[#e50914] text-xs font-bold uppercase tracking-[0.12em] block">
            ● COMING SOON
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Upcoming Cinema Releases
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Stay ahead of the biggest cinema events. Advance ticket bookings open 7 days prior to world premiere.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <MovieCardSkeleton key={n} />
            ))}
          </div>
        ) : upcomingMovies.length === 0 ? (
          <EmptyState
            icon="🎬"
            title="No Upcoming Releases Found"
            description="Check back soon for freshly announced blockbuster premiere schedules."
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {upcomingMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} isUpcoming={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Releases;
