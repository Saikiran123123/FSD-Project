import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { foodService } from '../services';
import { useBooking } from '../context/BookingContext';
import { formatINR } from '../utils/currency';
import LoadingSpinner from '../components/LoadingSpinner';

const FoodAndCombos = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const {
    selectedSeats,
    selectedFood,
    addFoodItem,
    removeFoodItem,
    seatsTotal,
    foodTotal,
    convenienceFee,
    holdExpiresAt,
  } = useBooking();

  const [foodItems, setFoodItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins in seconds

  const categories = ['All', 'Popcorn', 'Combos', 'Snacks', 'Beverages', 'Desserts'];

  useEffect(() => {
    const fetchFood = async () => {
      setLoading(true);
      try {
        const res = await foodService.getFoodItems(selectedCategory);
        if (res.success && res.data) {
          setFoodItems(res.data);
        }
      } catch (err) {
        console.error('Error fetching food items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [selectedCategory]);

  // Seat hold countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (holdExpiresAt) {
        const diff = Math.max(0, Math.floor((new Date(holdExpiresAt) - new Date()) / 1000));
        setTimeLeft(diff);
        if (diff <= 0) {
          alert('Your 5-minute reservation hold has expired. Please re-select your seats.');
          navigate(`/booking/seats/${showId}`);
        }
      } else {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [holdExpiresAt, showId, navigate]);

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const getQuantity = (itemId) => {
    const item = selectedFood.find((f) => f.foodItemId === itemId);
    return item ? item.quantity : 0;
  };

  if (loading) {
    return <LoadingSpinner text="Summoning gourmet snack counter & beverage combos..." />;
  }

  const grandEstimatedTotal = seatsTotal + foodTotal + convenienceFee;

  return (
    <div className="min-h-screen py-8 sm:py-10 text-white">
      <div className="container-cinema space-y-8">
        {/* Multi-Step Flow Indicator */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 text-xs font-bold uppercase tracking-wider select-none">
          <span className="text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
            <span className="w-4 h-4 rounded-full bg-emerald-500 text-black flex items-center justify-center text-[10px] font-black">
              ✓
            </span>
            <span>Seats ({selectedSeats.length})</span>
          </span>
          <span className="text-zinc-600">→</span>
          <span className="text-[#e50914] flex items-center gap-1.5 bg-[#e50914]/15 border border-[#e50914]/40 px-3.5 py-1 rounded-full shadow-[0_0_15px_rgba(229,9,20,0.25)]">
            <span className="w-4 h-4 rounded-full bg-[#e50914] text-white flex items-center justify-center text-[10px] font-black animate-pulse">
              2
            </span>
            <span>Snacks & Combos</span>
          </span>
          <span className="text-zinc-600">→</span>
          <span className="text-zinc-500 hidden sm:flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-white/10 text-zinc-400 flex items-center justify-center text-[10px]">
              3
            </span>
            <span>Checkout</span>
          </span>
          <span className="text-zinc-600 hidden sm:inline">→</span>
          <span className="text-zinc-500 hidden sm:flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-white/10 text-zinc-400 flex items-center justify-center text-[10px]">
              4
            </span>
            <span>Pass</span>
          </span>
        </div>

        {/* Top Banner with Countdown Timer */}
        <div className="glass-hero-panel p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ffb703] animate-pulse" />
              <span className="text-[#ffb703] text-xs font-black uppercase tracking-widest">
                Gourmet Concessions
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Pre-Order Fresh Popcorn, Snacks & Drinks
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Skip concession queues — your freshly prepared orders will be delivered straight to your seat or ready at the express counter.
            </p>
          </div>

          {/* 5-Min Timer Badge */}
          <div className="relative z-10 flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-2.5 rounded-2xl font-mono text-xs font-bold shadow-lg shrink-0">
            <span className="animate-spin text-sm">⏱️</span>
            <div>
              <span className="text-[10px] text-amber-500/80 block uppercase tracking-wider">Seat Lock</span>
              <span className="text-base font-black text-white">{formatTimer(timeLeft)}</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Food Items + Order Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 8 Cols: Menu Items */}
          <div className="lg:col-span-8 space-y-6">
            {/* Category Tabs */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-[#e50914] to-[#b80610] text-white shadow-lg shadow-red-950/50 border border-red-500/30'
                      : 'bg-[#12131f] border border-white/10 hover:border-white/20 text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Food Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {foodItems.map((item) => {
                const qty = getQuantity(item._id);

                return (
                  <div
                    key={item._id}
                    className="glass-card rounded-2xl p-4 flex gap-4 transition-all duration-300 hover:border-white/20 group"
                  >
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#181928] shrink-0 border border-white/10 relative">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=400&auto=format&fit=crop&q=80'}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase flex items-center gap-1 ${
                            item.isVegetarian
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${item.isVegetarian ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                            {item.isVegetarian ? 'VEG' : 'NON-VEG'}
                          </span>
                          {item.calories && (
                            <span className="text-[10px] text-zinc-500 font-mono">{item.calories} kcal</span>
                          )}
                        </div>

                        <h3 className="font-bold text-white text-sm truncate">{item.name}</h3>
                        <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5 leading-relaxed">{item.description}</p>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5">
                        <span className="font-mono font-black text-white text-sm">
                          {formatINR(item.price)}
                        </span>

                        {qty === 0 ? (
                          <button
                            onClick={() => addFoodItem(item)}
                            className="btn-cinema text-xs font-bold px-4 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
                          >
                            <span>+</span>
                            <span>ADD</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 bg-[#181928] border border-white/15 rounded-lg p-0.5 shadow-inner">
                            <button
                              onClick={() => removeFoodItem(item._id)}
                              className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center cursor-pointer transition-colors"
                            >
                              -
                            </button>
                            <span className="font-mono font-bold text-xs px-1.5 text-white">{qty}</span>
                            <button
                              onClick={() => addFoodItem(item)}
                              className="w-6 h-6 rounded bg-[#e50914] text-white font-bold flex items-center justify-center cursor-pointer transition-colors"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 4 Cols: Order Summary Sidebar */}
          <div className="lg:col-span-4 glass-panel rounded-3xl p-6 sm:p-7 space-y-6 lg:sticky lg:top-24 border border-white/10">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="font-black text-lg text-white">Order Summary</h3>
                <span className="text-xs text-zinc-400">Review your ticket & combo bill</span>
              </div>
              <span className="bg-[#ffb703]/15 text-[#ffb703] border border-[#ffb703]/30 text-[10px] font-bold px-2.5 py-1 rounded-full">
                {selectedSeats.length} Seats Locked
              </span>
            </div>

            {/* Seats breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-zinc-300">
                <span className="text-zinc-400">Selected Seats:</span>
                <span className="font-mono font-bold text-white bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                  {selectedSeats.map((s) => s.seatId).join(', ')}
                </span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>Tickets Subtotal:</span>
                <span className="font-mono font-bold text-zinc-200">{formatINR(seatsTotal)}</span>
              </div>
            </div>

            {/* Food breakdown */}
            <div className="pt-4 border-t border-white/10 space-y-2.5">
              <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider block">
                Food & Concessions:
              </span>
              {selectedFood.length === 0 ? (
                <p className="text-xs text-zinc-500 italic py-2">No gourmet snacks added yet.</p>
              ) : (
                <div className="space-y-2 text-xs">
                  {selectedFood.map((f) => (
                    <div key={f.foodItemId} className="flex justify-between items-center text-zinc-300">
                      <span className="truncate pr-2">
                        {f.name} <span className="text-[#ffb703] font-mono font-bold">x{f.quantity}</span>
                      </span>
                      <span className="font-mono font-bold text-white">{formatINR(f.subtotal)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Total & Action Buttons */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs text-zinc-400 block font-semibold">Grand Total (Est.)</span>
                  <span className="text-2xl font-black text-[#00d4aa] font-mono tracking-tight">
                    {formatINR(grandEstimatedTotal)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => navigate(`/booking/checkout/${showId}`)}
                  className="w-full btn-cinema text-xs font-black py-3.5 rounded-xl shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <span>→</span>
                </button>

                <button
                  onClick={() => navigate(`/booking/checkout/${showId}`)}
                  className="w-full btn-secondary text-xs font-bold py-3 rounded-xl cursor-pointer text-zinc-400 hover:text-white transition-colors"
                >
                  Skip Snacks & Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodAndCombos;
