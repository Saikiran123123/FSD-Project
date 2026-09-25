import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredCity, setPreferredCity] = useState('Hyderabad');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await register({
        name,
        email,
        password,
        phone,
        preferredCity,
        favoriteGenres: ['Science Fiction', 'Action', 'Adventure'],
      });

      if (res.success) {
        navigate('/');
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-[#07070b] relative">
      <div className="max-w-md w-full glass-panel p-8 sm:p-10 rounded-3xl space-y-6 shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#e50914]/20 rounded-full filter blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#e50914] to-[#990000] flex items-center justify-center font-black text-white text-xl mx-auto shadow-lg shadow-red-600/30 border border-white/10">
            CB
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Create Account</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Join CineBook today & claim your 50% first-time booking discount
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-semibold mb-1.5">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Sai Kiran"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#10111a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-[#e50914] transition-colors"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1.5">Email Address</label>
            <input
              type="email"
              required
              placeholder="user@cinebook.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#10111a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-[#e50914] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1.5">Phone (Optional)</label>
              <input
                type="tel"
                placeholder="+91 98765..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#10111a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-[#e50914] transition-colors"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1.5">City</label>
              <select
                value={preferredCity}
                onChange={(e) => setPreferredCity(e.target.value)}
                className="w-full bg-[#10111a] border border-white/10 rounded-xl px-3.5 py-3 text-white outline-none cursor-pointer"
              >
                <option value="Hyderabad">Hyderabad</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi-NCR">Delhi-NCR</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1.5">Password</label>
            <input
              type="password"
              required
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#10111a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-[#e50914] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-cinema font-bold py-3.5 rounded-xl shadow-xl transition-all cursor-pointer text-xs disabled:opacity-50 mt-3"
          >
            {loading ? 'Creating Account...' : 'Sign Up & Get 50% Off'}
          </button>
        </form>

        <div className="text-center pt-3 border-t border-white/5 text-xs text-zinc-400">
          <span>Already have an account? </span>
          <Link to="/login" className="text-[#e50914] font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
