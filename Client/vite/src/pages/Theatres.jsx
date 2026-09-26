import React, { useState, useEffect } from 'react';
import { theatreService } from '../services';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import { CURATED_THEATRES } from '../data/curatedData';

const Theatres = () => {
  const [theatres, setTheatres] = useState([]);
  const [selectedCity, setSelectedCity] = useState('All');
  const [loading, setLoading] = useState(true);

  const cities = ['All', 'Hyderabad', 'Bengaluru', 'Mumbai', 'Chennai', 'Delhi-NCR'];

  useEffect(() => {
    const fetchTheatres = async () => {
      setLoading(true);
      try {
        const cityParam = selectedCity === 'All' ? '' : selectedCity;
        const res = await theatreService.getTheatres(cityParam);
        if (res.success && res.data && res.data.length > 0) {
          setTheatres(res.data);
        } else {
          const matching = CURATED_THEATRES.filter(
            (t) => selectedCity === 'All' || t.city.toLowerCase() === selectedCity.toLowerCase()
          );
          setTheatres(matching.length > 0 ? matching : CURATED_THEATRES);
        }
      } catch (err) {
        console.error(err);
        const matching = CURATED_THEATRES.filter(
          (t) => selectedCity === 'All' || t.city.toLowerCase() === selectedCity.toLowerCase()
        );
        setTheatres(matching.length > 0 ? matching : CURATED_THEATRES);
      } finally {
        setLoading(false);
      }
    };

    fetchTheatres();
  }, [selectedCity]);

  if (loading) {
    return <LoadingSpinner text="Locating luxury multiplexes & cinema venues..." />;
  }

  return (
    <div className="theatres-page min-h-screen bg-[#07070b] text-white py-16 sm:py-20">
      <div className="container-cinema space-y-10">
        {/* Header & City Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div>
            <span className="text-[#e50914] text-xs font-bold uppercase tracking-[0.12em] block mb-2">
              ● PREMIER VENUES
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Cinema Multiplexes & Screens
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              Experience ultra-luxurious recliner auditoriums, IMAX projection, and Dolby Atmos audio
            </p>
          </div>

          {/* City Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCity === city
                    ? 'bg-[#e50914] text-white shadow-md shadow-red-600/20'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.08]'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {theatres.length === 0 ? (
          <div className="pt-8">
            <EmptyState
              icon="🏛️"
              title={`No Multiplexes in ${selectedCity}`}
              description="We are expanding to more cinema locations soon. Try selecting another city or 'All'."
              actionLabel="View All Cities"
              onAction={() => setSelectedCity('All')}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            {theatres.map((theatre) => (
              <div
                key={theatre._id}
                className="glass-card rounded-3xl overflow-hidden flex flex-col group transition-all"
              >
                {/* Image banner */}
                <div className="h-60 w-full overflow-hidden relative bg-[#10111a]">
                  <img
                    src={
                      theatre.image ||
                      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80'
                    }
                    alt={theatre.name}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10 text-xs font-bold text-white shadow-lg">
                    📍 {theatre.city}
                  </div>
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-[#ffb703]/30 text-[#ffb703] text-xs font-bold shadow-lg flex items-center gap-1">
                    <span>★</span>
                    <span>{theatre.rating || 4.9}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-7 flex-1 flex flex-col justify-between space-y-5">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#e50914] transition-colors">
                      {theatre.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{theatre.address}</p>
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-2.5">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
                      Cinema Amenities & Projection:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(theatre.facilities || ['IMAX 3D Laser', 'Dolby Atmos 64-Channel', 'VIP Leather Recliners', 'Gourmet In-Seat Dining']).map(
                        (facility, i) => (
                          <span
                            key={i}
                            className="bg-white/5 border border-white/10 text-zinc-300 text-[11px] px-3 py-1 rounded-lg"
                          >
                            ✓ {facility}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Theatres;
