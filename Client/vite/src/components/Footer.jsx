import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#050508] border-t border-white/[0.07] pt-16 pb-10 text-zinc-400 text-xs">
      <div className="container-cinema">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-12">
          {/* Col 1: Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#e50914] to-[#990000] flex items-center justify-center font-black text-white text-sm shadow-md border border-white/10">
                CB
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Cine<span className="text-[#e50914]">Book</span>
              </span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-xs">
              Premier intelligent cinema booking platform with real-time atomic seat locks, AI concierge, gourmet concession pre-ordering, and express digital QR turnstile entry.
            </p>
            <div className="flex items-center gap-3 text-sm text-zinc-400">
              <span className="hover:text-white cursor-pointer transition-colors">📱 iOS & Android</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer transition-colors">🎬 IMAX Laser</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-[0.12em]">Explore Catalog</h4>
            <ul className="space-y-2.5">
              <li><Link to="/movies" className="hover:text-white transition-colors">Now Showing Movies</Link></li>
              <li><Link to="/releases" className="hover:text-white transition-colors">Upcoming Releases</Link></li>
              <li><Link to="/theatres" className="hover:text-white transition-colors">Luxury Multiplexes</Link></li>
              <li><Link to="/offers" className="hover:text-white transition-colors">Exclusive Promo Offers</Link></li>
            </ul>
          </div>

          {/* Col 3: Support */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-[0.12em]">Help & Assurance</h4>
            <ul className="space-y-2.5">
              <li><Link to="/contact" className="hover:text-white transition-colors">Help Center & FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Cancellation & 100% Refund</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Auditorium Formats (IMAX, 4DX)</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Corporate Screenings</Link></li>
            </ul>
          </div>

          {/* Col 4: Experience */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-[0.12em]">Presence & Formats</h4>
            <p className="text-zinc-400 leading-relaxed">
              Operating premier screens across Hyderabad, Bengaluru, Mumbai & Delhi-NCR.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="bg-white/5 px-2.5 py-1 rounded-md text-[10px] text-zinc-300 border border-white/10 font-bold">IMAX 3D Laser</span>
              <span className="bg-white/5 px-2.5 py-1 rounded-md text-[10px] text-zinc-300 border border-white/10 font-bold">Dolby Atmos</span>
              <span className="bg-white/5 px-2.5 py-1 rounded-md text-[10px] text-zinc-300 border border-white/10 font-bold">4DX Experience</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.07] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>
            © {new Date().getFullYear()} CineBook Platform. Crafted with React, Vite, Node.js & MongoDB Atlas.
          </p>
          <div className="flex items-center gap-4">
            <span>🔒 256-Bit SSL Encrypted</span>
            <span>•</span>
            <span>⚡ Atomic 5-Min Seat Lock</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
