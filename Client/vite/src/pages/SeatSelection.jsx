import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { showService } from '../services';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import SeatMap from '../components/SeatMap';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatINR } from '../utils/currency';

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    selectedMovie,
    selectedTheatre,
    setSelectedShow,
    selectedSeats,
    setSelectedSeats,
    setHoldExpiresAt,
  } = useBooking();

  const [showData, setShowData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recommendedSeatIds, setRecommendedSeatIds] = useState([]);
  const [holding, setHolding] = useState(false);

  useEffect(() => {
    const fetchShow = async () => {
      setLoading(true);
      try {
        const res = await showService.getShowSeats(showId);
        if (res.success && res.data) {
          setShowData(res.data);
          setSelectedShow(res.data);
        }
      } catch {
        setError('Failed to load show seat layout');
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [showId, setSelectedShow]);

  const handleToggleSeat = (seat) => {
    const isSelected = selectedSeats.some((s) => s.seatId === seat.seatId);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.seatId !== seat.seatId));
    } else {
      if (selectedSeats.length >= 8) {
        alert('Maximum 8 seats allowed per reservation');
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleAutoPickSmartSeats = async () => {
    try {
      const res = await showService.getSmartSeats(showId, 2, 'Gold');
      if (res.success && res.data && res.data.length > 0) {
        setSelectedSeats(res.data);
        setRecommendedSeatIds(res.data.map((s) => s.seatId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGroupRunPick = async (groupSize = 4) => {
    try {
      const res = await showService.getGroupSeats(showId, groupSize, 'Gold');
      if (res.success && res.data && res.data.length > 0) {
        const bestRun = res.data[0];
        setSelectedSeats(bestRun.seatObjects || []);
        setRecommendedSeatIds(bestRun.seats || []);
      } else {
        alert(`No continuous run of ${groupSize} seats found. Please select individually.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleProceedToSnacks = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/booking/seats/${showId}` } });
      return;
    }

    if (selectedSeats.length === 0) {
      setError('Please select at least 1 cinema seat to proceed');
      return;
    }

    setHolding(true);
    setError('');

    try {
      const seatIds = selectedSeats.map((s) => s.seatId);
      const res = await showService.holdSeats(showId, seatIds);

      if (res.success) {
        setHoldExpiresAt(res.data.expiresAt);
        navigate(`/booking/food/${showId}`);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to lock seats. Some seats may have just been reserved by another guest.'
      );
      // Refresh seat layout
      const refreshRes = await showService.getShowSeats(showId);
      if (refreshRes.success && refreshRes.data) {
        setShowData(refreshRes.data);
      }
    } finally {
      setHolding(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Rendering interactive cinema seat matrix..." />;
  }

  const seatsSubtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="seat-selection-page min-h-screen bg-[#07070b] text-white py-12 sm:py-16">
      <div className="container-cinema space-y-10">
        {/* 1. Multi-Step Header Indicator */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 text-xs font-bold uppercase tracking-wider select-none">
          <span className="text-[#e50914] flex items-center gap-2 pb-1 border-b-2 border-[#e50914]">
            <span className="w-6 h-6 rounded-full bg-[#e50914] text-white flex items-center justify-center text-xs font-black">
              1
            </span>
            Seat Selection
          </span>
          <span className="text-zinc-600">→</span>
          <span className="text-zinc-500 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white/5 text-zinc-400 flex items-center justify-center text-xs">
              2
            </span>
            Snacks & Combos
          </span>
          <span className="text-zinc-600">→</span>
          <span className="text-zinc-500 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white/5 text-zinc-400 flex items-center justify-center text-xs">
              3
            </span>
            Checkout
          </span>
          <span className="text-zinc-600">→</span>
          <span className="text-zinc-500 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white/5 text-zinc-400 flex items-center justify-center text-xs">
              4
            </span>
            Confirmation
          </span>
        </div>

        {/* Movie & Theatre Info Bar */}
        <div className="glass-panel p-5 sm:p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[#ffb703] text-[10px] font-bold uppercase tracking-wider block mb-1">
              ● SELECTED EXPERIENCE
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {showData?.movieSnapshot?.title || selectedMovie?.title || 'Selected Movie'}
            </h2>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              🏛️ {showData?.theatreSnapshot?.name || selectedTheatre?.name} • 🎬 {showData?.screenSnapshot?.screenName || 'Screen 1'} • ⏱️ {showData?.showTime} • 📅 {showData?.showDate}
            </p>
          </div>

          {/* AI Quick Auto-Pick */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleAutoPickSmartSeats}
              className="btn-secondary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>✨</span>
              <span>Best 2 Seats</span>
            </button>

            <button
              onClick={() => handleGroupRunPick(4)}
              className="btn-secondary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>👥</span>
              <span>Group of 4</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-2xl flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* 2. Main Seat Matrix & Summary Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 items-start">
          {/* Left 2 Cols: Seat Matrix */}
          <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8">
            <SeatMap
              seats={showData?.seats || []}
              selectedSeatIds={selectedSeats.map((s) => s.seatId)}
              onToggleSeat={handleToggleSeat}
              recommendedSeatIds={recommendedSeatIds}
            />
          </div>

          {/* Right Col: Booking Summary Card */}
          <div className="glass-panel rounded-3xl p-7 space-y-6 lg:sticky lg:top-24">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-black text-lg text-white">Booking Summary</h3>
              <span className="bg-[#e50914]/20 text-[#ff4d58] border border-[#e50914]/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                {selectedSeats.length} / 8 Seats
              </span>
            </div>

            {/* Selected Seats Chips */}
            <div>
              <span className="text-xs text-zinc-400 font-semibold block mb-2.5">Selected Seats:</span>
              {selectedSeats.length === 0 ? (
                <p className="text-xs text-zinc-500 italic">No seats selected yet. Click on the map to select.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map((seat) => (
                    <span
                      key={seat.seatId}
                      className="bg-[#e50914] text-white font-mono font-bold text-xs px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-md shadow-red-600/30"
                    >
                      <span>{seat.seatId}</span>
                      <button
                        onClick={() => handleToggleSeat(seat)}
                        className="text-white/80 hover:text-white text-[10px] cursor-pointer ml-0.5"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 text-xs pt-3 border-t border-white/10">
              <div className="flex justify-between text-zinc-300">
                <span>Tickets Subtotal</span>
                <span className="font-mono font-bold text-white">{formatINR(seatsSubtotal)}</span>
              </div>

              <div className="flex justify-between text-zinc-400">
                <span>Convenience Fee</span>
                <span className="font-mono font-semibold">₹35 (Calculated at checkout)</span>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <div>
                  <span className="text-xs text-zinc-400 block font-semibold">Total Amount</span>
                  <span className="text-2xl font-black text-[#00d4aa] font-mono">
                    {formatINR(seatsSubtotal)}
                  </span>
                </div>

                <button
                  onClick={handleProceedToSnacks}
                  disabled={selectedSeats.length === 0 || holding}
                  className="btn-cinema text-xs font-bold px-6 py-3.5 rounded-xl disabled:opacity-40 flex items-center gap-2 cursor-pointer shadow-xl"
                >
                  <span>{holding ? 'Locking Seats...' : 'Proceed to Snacks'}</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-white/5 border border-white/5 p-3.5 rounded-2xl flex items-center gap-2 text-[11px] text-zinc-400">
              <span>🔒</span>
              <span>Proceeding locks these seats for 5 minutes under your account.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
