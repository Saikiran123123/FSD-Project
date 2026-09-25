import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { bookingService } from '../services';
import { formatINR } from '../utils/currency';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingService.getMyBookings();
      if (res.success && res.data) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async () => {
    if (!cancelModalBooking) return;
    setCancelling(true);
    try {
      const res = await bookingService.cancelBooking(cancelModalBooking._id);
      if (res.success) {
        setActionMsg(`Booking ${cancelModalBooking.bookingId} cancelled successfully. 100% refund initiated.`);
        setCancelModalBooking(null);
        await fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving your digital cinema passes..." />;
  }

  return (
    <div className="my-bookings-page min-h-screen bg-[#07070b] text-white py-16 sm:py-20">
      <div className="container-cinema max-w-5xl space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
          <div>
            <span className="text-[#e50914] text-xs font-bold uppercase tracking-[0.12em] block mb-2">
              ● GUEST PASSES
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              My Movie Tickets
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              Access your active passes, download digital QR tickets, or manage reservations
            </p>
          </div>

          <Link
            to="/movies"
            className="btn-cinema text-xs font-bold px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 self-start sm:self-auto"
          >
            <span>+</span>
            <span>Book New Movie</span>
          </Link>
        </div>

        {actionMsg && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-2xl flex items-center justify-between">
            <span>✓ {actionMsg}</span>
            <button onClick={() => setActionMsg('')} className="text-white hover:text-emerald-300 cursor-pointer">
              ✕
            </button>
          </div>
        )}

        {/* Bookings List / Empty State */}
        {bookings.length === 0 ? (
          <div className="pt-8">
            <EmptyState
              icon="🎟️"
              title="No Cinema Bookings Yet"
              description="You haven't reserved any tickets yet. Explore trending blockbusters and experience IMAX & Dolby Atmos!"
              actionLabel="Explore Blockbusters"
              actionLink="/movies"
            />
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map((b) => {
              const isCancelled = b.bookingStatus === 'cancelled';

              return (
                <div
                  key={b._id}
                  className={`glass-card p-6 sm:p-7 transition-all ${
                    isCancelled ? 'border-white/5 opacity-60' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    {/* Left: Info */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-zinc-400">
                          #{b.bookingId}
                        </span>
                        <span
                          className={`text-[10px] font-black px-3 py-0.5 rounded-full uppercase ${
                            isCancelled
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {isCancelled ? '✕ Cancelled & Refunded' : '● Confirmed & Active'}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black text-white">
                        {b.movieSnapshot?.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-zinc-400 font-medium">
                        <span>🏛️ {b.theatreSnapshot?.name}</span>
                        <span>🎬 {b.showSnapshot?.screenName || 'Screen 1'}</span>
                        <span>📅 {b.showSnapshot?.showDate} • {b.showSnapshot?.showTime}</span>
                      </div>

                      <div className="flex items-center gap-2 pt-1 text-xs">
                        <span className="text-zinc-400">Seats:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {b.seats?.map((s) => (
                            <span
                              key={s.seatId}
                              className="bg-white/5 border border-white/10 text-white font-mono font-bold px-2.5 py-0.5 rounded-lg"
                            >
                              {s.seatId}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col sm:flex-row md:flex-col items-end justify-between gap-4 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                      <div className="text-right">
                        <span className="text-[10px] text-zinc-500 block uppercase tracking-wider font-semibold">Total Amount</span>
                        <span className="text-xl font-black text-[#00d4aa] font-mono">
                          {formatINR(b.pricing?.totalAmount || 0)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        {!isCancelled && (
                          <>
                            <button
                              onClick={() => setSelectedTicket(b)}
                              className="btn-cinema text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                            >
                              <span>📱</span>
                              <span>View QR Pass</span>
                            </button>

                            <button
                              onClick={() => setCancelModalBooking(b)}
                              className="btn-secondary text-xs font-semibold px-4 py-2.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* QR Code Pass Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="relative w-full max-w-md bg-[#10111a] border border-white/15 rounded-3xl p-7 sm:p-9 space-y-6 shadow-2xl">
              <button
                onClick={() => setSelectedTicket(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>

              <div className="text-center space-y-1.5">
                <span className="bg-[#e50914] text-white text-[10px] font-black uppercase px-3 py-0.5 rounded-full">
                  DIGITAL ENTRY PASS
                </span>
                <h3 className="text-2xl font-black text-white pt-1">{selectedTicket.movieSnapshot?.title}</h3>
                <p className="text-xs text-zinc-400 font-mono">#{selectedTicket.bookingId}</p>
              </div>

              {/* QR SVG */}
              <div className="flex justify-center bg-white p-5 rounded-2xl max-w-[200px] mx-auto shadow-2xl">
                <QRCodeSVG
                  value={JSON.stringify({
                    bookingId: selectedTicket.bookingId,
                    seats: selectedTicket.seats?.map((s) => s.seatId),
                    showId: selectedTicket.showId,
                  })}
                  size={160}
                  level="H"
                />
              </div>

              <div className="space-y-2 text-xs text-center border-t border-white/10 pt-4 text-zinc-300">
                <p>🏛️ {selectedTicket.theatreSnapshot?.name}</p>
                <p>⏱️ {selectedTicket.showSnapshot?.showDate} at {selectedTicket.showSnapshot?.showTime}</p>
                <p className="font-mono font-bold text-[#ffb703]">
                  Seats: {selectedTicket.seats?.map((s) => s.seatId).join(', ')}
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="w-full btn-cinema py-3.5 rounded-xl text-xs font-bold cursor-pointer"
              >
                Print / Save Ticket
              </button>
            </div>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {cancelModalBooking && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="relative w-full max-w-md bg-[#10111a] border border-rose-500/30 rounded-3xl p-7 sm:p-9 space-y-6 shadow-2xl">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>⚠️</span>
                <span>Cancel Cinema Reservation?</span>
              </h3>

              <p className="text-xs text-zinc-300 leading-relaxed">
                Are you sure you want to cancel booking <strong className="text-white font-mono">{cancelModalBooking.bookingId}</strong> for <strong>{cancelModalBooking.movieSnapshot?.title}</strong>?
              </p>

              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-xs text-emerald-400 space-y-1">
                <p className="font-bold">✓ 100% Refund Policy</p>
                <p className="text-zinc-400 text-[11px]">
                  Full refund of {formatINR(cancelModalBooking.pricing?.totalAmount || 0)} will be credited back to your payment source.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setCancelModalBooking(null)}
                  className="btn-secondary text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancelBooking}
                  disabled={cancelling}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow-lg disabled:opacity-40"
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
