import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [selectedCity, setSelectedCity] = useState('Hyderabad');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'Theatres', path: '/theatres' },
    { name: 'Releases', path: '/releases' },
    { name: 'Offers', path: '/offers' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#07070b]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl py-2.5'
          : 'bg-[#07070b]/80 backdrop-blur-md border-b border-white/[0.06] py-3.5'
      }`}
    >
      <div className="container-cinema flex items-center justify-between h-16">
        {/* Left: Brand Logo (Wordmark + Subtle Subtitle) */}
        <Link to="/" className="flex flex-col group select-none">
          <span className="text-2xl lg:text-[28px] font-[800] tracking-tight text-white leading-none">
            Cine<span className="text-[#e50914]">Book</span>
          </span>
          <span className="text-[10px] uppercase tracking-[0.22em] text-zinc-400 font-semibold mt-1">
            PREMIER CINEMA
          </span>
        </Link>

        {/* Center: Clean Text Navigation (No random badges) */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `text-[14.5px] transition-colors duration-200 select-none relative py-1 ${
                  isActive
                    ? 'text-white font-semibold after:absolute after:-bottom-1.5 after:left-0 after:right-0 after:h-[2px] after:bg-[#e50914] after:rounded-full'
                    : 'text-zinc-400 hover:text-white font-medium'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Right: Location Selector + Auth Actions */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Location Selector */}
          <div className="hidden sm:flex items-center gap-1.5 bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-xl px-3 py-1.5 transition-colors">
            <span className="text-xs">📍</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent border-none outline-none text-[13.5px] font-medium text-zinc-200 cursor-pointer appearance-none pr-3"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a1a1aa'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', backgroundSize: '12px' }}
              aria-label="Select City"
            >
              <option value="Hyderabad" className="bg-[#10111a] text-white">Hyderabad</option>
              <option value="Bengaluru" className="bg-[#10111a] text-white">Bengaluru</option>
              <option value="Mumbai" className="bg-[#10111a] text-white">Mumbai</option>
              <option value="Delhi-NCR" className="bg-[#10111a] text-white">Delhi-NCR</option>
            </select>
          </div>

          {/* User Auth Menu */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-xl pl-1.5 pr-3 py-1 text-xs text-white transition-all cursor-pointer"
                aria-expanded={dropdownOpen}
                aria-label="User menu"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#e50914] to-[#b80c14] flex items-center justify-center font-bold text-white text-xs shadow-md">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="font-semibold text-[13.5px] hidden sm:inline max-w-[110px] truncate">{user?.name?.split(' ')[0]}</span>
                <span className="text-[9px] text-zinc-400">▾</span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-60 bg-[#10111a]/95 border border-white/10 rounded-2xl shadow-2xl py-2 z-50 backdrop-blur-2xl animate-fadeIn">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">{user?.email}</p>
                    {isAdmin && (
                      <span className="inline-block mt-2 bg-[#ffb703]/20 text-[#ffb703] border border-[#ffb703]/40 text-[9px] font-black px-2 py-0.5 rounded-md uppercase">
                        ⚡ Cinema Administrator
                      </span>
                    )}
                  </div>

                  <div className="py-1">
                    <Link
                      to="/my-bookings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <span>🎟️</span>
                      <span>My Bookings</span>
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <span>👤</span>
                      <span>Profile & Settings</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-[#ffb703] hover:bg-[#ffb703]/10 transition-colors"
                      >
                        <span>⚡</span>
                        <span>Admin Command Center</span>
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-white/10 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <span>🚪</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-[14px] font-medium text-zinc-300 hover:text-white transition-colors px-2 py-1"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="h-[38px] px-4 rounded-xl bg-[#e50914] hover:bg-[#ff1f2d] text-white text-[13.5px] font-semibold shadow-md shadow-red-600/20 transition-all cursor-pointer flex items-center justify-center"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white cursor-pointer transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a10]/95 border-b border-white/10 px-4 py-4 space-y-2 backdrop-blur-2xl animate-fadeIn">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center h-11 px-4 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-[#e50914] text-white shadow-md shadow-red-600/20'
                    : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
            <span>Location:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-[#141522] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
            >
              <option value="Hyderabad">Hyderabad</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi-NCR">Delhi-NCR</option>
            </select>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;