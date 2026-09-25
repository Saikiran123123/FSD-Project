import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { bookingService } from '../services';
import { formatINR } from '../utils/currency';
import LoadingSpinner from '../components/LoadingSpinner';

const Confirmation = () => {
  const { bookingId } = useParams();
  const location = useLocation();

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!booking && bookingId) {
      const fetchBooking = async () => {
        setLoading(true);
        try {
          const res = await bookingService.getBookingById(bookingId);
          if (res.success && res.data) {
            setBooking(res.data);
          }
        } catch {
          setError('Failed to retrieve digital pass');
        } finally {
          setLoading(false);
        }
      };

      fetchBooking();
    }
  }, [bookingId, booking]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <LoadingSpinner text="Generating your official CineBook Digital Pass..." />;
  }

  if (error || !booking) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-white p-6 text-center container-cinema">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center text-3xl mb-4">
          ⚠️
        </div>
        <h2 className="text-xl font-bold">Booking Not Found</h2>
        <p className="text-xs text-zinc-400 mt-1 mb-6">{error || 'Invalid or expired booking identifier.'}</p>
        <Link to="/my-bookings" className="btn-cinema text-xs font-bold px-6 py-3 rounded-xl">
          View My Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 sm:py-14 text-white">
      <div className="container-cinema max-w-4xl space-y-8">
        {/* Celebration Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-3xl mx-auto shadow-[0_0_30px_rgba(16,185,129,0.35)]">
            ✓
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Booking Confirmed & Locked!
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            Your seats are officially reserved. Present this digital pass at the cinema turnstile for express contactless admission.
          </p>
        </div>

        {/* Digital Cinema Boarding-Pass Ticket */}
        <div
          id="printable-ticket"
          className="bg-gradient-to-b from-[#181928] to-[#0f101b] border border-white/15 rounded-3xl overflow-hidden shadow-2xl relative"
        >
          {/* Ticket Red Header */}
          <div className="bg-gradient-to-r from-[#e50914] to-[#b80610] px-6 sm:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-white font-black text-xl tracking-tight">CineBook</span>
              <span className="bg-black/30 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-white/20">
                DIGITAL ENTRY PASS
              </span>
            </div>
            <span className="font-mono text-xs font-bold text-white/90 bg-black/20 px-3 py-1 rounded-lg">
              ID: {booking.bookingId}
            </span>
          </div>

          {/* Ticket Main Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Movie Overview */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {booking.movieSnapshot?.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className="badge-format text-[10px]">
                    {booking.movieSnapshot?.format || 'IMAX 3D'}
                  </span>
                  <span className="bg-white/5 border border-white/10 text-zinc-300 text-[10px] font-bold px-2 py-0.5 rounded">
                    {booking.movieSnapshot?.language || 'English'}
                  </span>
                  <span className="bg-white/5 border border-white/10 text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded">
                    {booking.movieSnapshot?.certification || 'UA'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Confirmed & Active</span>
                </span>
              </div>
            </div>

            {/* Cinema Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 py-2 text-xs">
              <div className="space-y-1">
                <span className="text-zinc-500 font-bold block uppercase tracking-wider text-[10px]">Multiplex</span>
                <span className="font-bold text-white block text-sm">{booking.theatreSnapshot?.name}</span>
                <span className="text-zinc-400 block text-[11px]">{booking.theatreSnapshot?.city}</span>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-500 font-bold block uppercase tracking-wider text-[10px]">Screen & Audio</span>
                <span className="font-bold text-white block text-sm">{booking.showSnapshot?.screenName || 'Screen 1'}</span>
                <span className="text-zinc-400 block text-[11px]">{booking.showSnapshot?.format || 'Dolby Atmos'}</span>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-500 font-bold block uppercase tracking-wider text-[10px]">Date & Showtime</span>
                <span className="font-bold text-white block text-sm">{booking.showSnapshot?.showTime}</span>
                <span className="text-zinc-400 block text-[11px]">{booking.showSnapshot?.showDate}</span>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-500 font-bold block uppercase tracking-wider text-[10px]">Reserved Seats ({booking.seats?.length})</span>
                <span className="font-mono font-black text-[#ffb703] block text-sm">
                  {booking.seats?.map((s) => s.seatId).join(', ')}
                </span>
                <span className="text-zinc-400 block text-[11px]">Category: {booking.seats?.[0]?.category || 'Gold'}</span>
              </div>
            </div>

            {/* QR Code & Turnstile Scanner Area */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 bg-black/40 p-6 rounded-2xl border border-white/10">
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="text-[#ffb703] text-xs font-black uppercase tracking-widest">
                    Turnstile Express QR
                  </span>
                </div>
                <h4 className="text-base font-bold text-white">Contactless Admission Pass</h4>
                <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
                  Hold this QR code directly against the scanner turnstile at the auditorium entrance.
                </p>
                <div className="text-[11px] font-mono text-zinc-500 pt-1">
                  TXN: {booking.paymentDetails?.paymentTransactionId || 'TXN_CINE_8829'}
                </div>
              </div>

              {/* High-Contrast White Card for rapid optical scanner reading */}
              <div className="bg-white p-3.5 rounded-2xl shadow-2xl shrink-0">
                <QRCodeSVG
                  value={JSON.stringify({
                    bookingId: booking.bookingId,
                    seats: booking.seats?.map((s) => s.seatId),
                    showId: booking.showId,
                  })}
                  size={124}
                  level="H"
                />
              </div>
            </div>

            {/* Concessions Itemization */}
            {booking.foodItems && booking.foodItems.length > 0 && (
              <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
                <span className="text-zinc-400 font-bold uppercase tracking-wider block text-[11px]">
                  Pre-Ordered Concessions:
                </span>
                <div className="flex flex-wrap gap-2">
                  {booking.foodItems.map((f, i) => (
                    <span key={i} className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-zinc-300">
                      🍿 {f.name} <span className="text-[#ffb703] font-mono font-bold">(x{f.quantity})</span> - {formatINR(f.subtotal)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Paid Amount Summary */}
            <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs">
              <span className="text-zinc-400">Total Paid (Incl. GST & Convenience):</span>
              <span className="text-2xl font-black text-[#00d4aa] font-mono">
                {formatINR(booking.pricing?.totalAmount || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Action CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="btn-cinema text-xs font-bold px-6 py-3.5 rounded-xl flex items-center gap-2 shadow-lg cursor-pointer transition-all"
          >
            <span>🖨️</span>
            <span>Print / Save Pass</span>
          </button>

          <Link
            to="/my-bookings"
            className="btn-secondary text-xs font-bold px-6 py-3.5 rounded-xl flex items-center gap-2 transition-colors"
          >
            <span>🎟️</span>
            <span>View in My Bookings</span>
          </Link>

          <Link
            to="/"
            className="btn-secondary text-xs font-bold px-6 py-3.5 rounded-xl text-zinc-400 hover:text-white transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
