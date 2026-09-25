import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [preferredCity, setPreferredCity] = useState(user?.preferredCity || 'Hyderabad');
  const [favoriteGenres, setFavoriteGenres] = useState(
    user?.favoriteGenres || ['Action', 'Science Fiction', 'Adventure']
  );
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const allGenres = [
    'Action',
    'Adventure',
    'Science Fiction',
    'Drama',
    'Comedy',
    'Thriller',
    'Animation',
    'Fantasy',
    'Horror',
  ];

  const handleToggleGenre = (genre) => {
    if (favoriteGenres.includes(genre)) {
      setFavoriteGenres(favoriteGenres.filter((g) => g !== genre));
    } else {
      setFavoriteGenres([...favoriteGenres, genre]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const res = await updateProfile({
        name,
        phone,
        preferredCity,
        favoriteGenres,
      });
      if (res.success) {
        setMsg('Profile preferences updated successfully!');
      }
    } catch {
      setMsg('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page min-h-screen bg-[#07070b] text-white py-16 sm:py-20">
      <div className="container-cinema max-w-4xl space-y-10">
        <div>
          <span className="text-[#e50914] text-xs font-bold uppercase tracking-[0.12em] block mb-2">
            ● GUEST ACCOUNT
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Profile & Cinema Preferences
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            Customize your cinema city, favourite movie genres, and account details
          </p>
        </div>

        {msg && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-2xl flex items-center gap-2">
            <span>✓</span>
            <span>{msg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="glass-panel rounded-3xl p-7 sm:p-10 space-y-8">
          {/* User Card Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-white/10 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#e50914] to-[#ffb703] flex items-center justify-center font-black text-2xl text-white shadow-xl border border-white/10">
              {name ? name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-xl text-white">{name}</h3>
              <p className="text-xs text-zinc-400 font-mono">{user?.email}</p>
              <span className="inline-block mt-1 text-[10px] bg-white/10 text-[#ffb703] border border-[#ffb703]/30 font-bold px-3 py-1 rounded-full uppercase">
                {user?.role === 'admin' ? '⚡ Cinema Administrator' : '🎟️ CineBook Premier Member'}
              </span>
            </div>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block text-zinc-300 mb-2 font-semibold">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#10111a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#e50914] transition-colors"
              />
            </div>

            <div>
              <label className="block text-zinc-300 mb-2 font-semibold">Phone Number</label>
              <input
                type="tel"
                placeholder="+91 98765..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#10111a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#e50914] transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-zinc-300 mb-2 font-semibold">Preferred Cinema Location</label>
              <select
                value={preferredCity}
                onChange={(e) => setPreferredCity(e.target.value)}
                className="w-full bg-[#10111a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none cursor-pointer"
              >
                <option value="Hyderabad">Hyderabad (Telangana)</option>
                <option value="Bengaluru">Bengaluru (Karnataka)</option>
                <option value="Mumbai">Mumbai (Maharashtra)</option>
                <option value="Delhi-NCR">Delhi-NCR (National Capital)</option>
              </select>
            </div>
          </div>

          {/* Favorite Genres Pills */}
          <div className="pt-4 border-t border-white/10 space-y-3 text-xs">
            <label className="block text-zinc-300 font-semibold">
              Favorite Movie Genres (Used for AI Cinema Recommendations)
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              {allGenres.map((genre) => {
                const isSelected = favoriteGenres.includes(genre);
                return (
                  <button
                    type="button"
                    key={genre}
                    onClick={() => handleToggleGenre(genre)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#e50914] text-white shadow-md shadow-red-600/20'
                        : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10'
                    }`}
                  >
                    {isSelected ? `✓ ${genre}` : `+ ${genre}`}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-cinema px-8 py-3.5 rounded-xl text-xs font-bold shadow-xl cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Saving Changes...' : 'Save Preferences'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
