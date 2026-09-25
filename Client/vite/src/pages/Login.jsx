import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setError(res.message || 'Invalid email or password');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@cinebook.com');
      setPassword('Admin@123');
    } else {
      setEmail('user@cinebook.com');
      setPassword('User@123');
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
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Welcome Back</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Sign in to access your digital tickets & exclusive cinema perks
          </p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-3.5 space-y-2.5 text-xs backdrop-blur-md">
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
            1-Click Demo Login:
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('user')}
              className="flex-1 btn-secondary text-[11px] font-bold py-2 rounded-xl cursor-pointer text-center"
            >
              Guest User
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('admin')}
              className="flex-1 bg-[#ffb703]/15 text-[#ffb703] border border-[#ffb703]/30 hover:bg-[#ffb703]/25 text-[11px] font-bold py-2 rounded-xl cursor-pointer text-center transition-colors"
            >
              ⚡ Administrator
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-zinc-300 font-semibold">Password</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-zinc-400 hover:text-white cursor-pointer"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••"
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
            {loading ? 'Authenticating...' : 'Sign In to CineBook'}
          </button>
        </form>

        <div className="text-center pt-3 border-t border-white/5 text-xs text-zinc-400">
          <span>Don't have an account? </span>
          <Link to="/register" className="text-[#e50914] font-bold hover:underline">
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
