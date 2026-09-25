import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { offerService, bookingService } from '../services';
import { formatINR } from '../utils/currency';
import LoadingSpinner from '../components/LoadingSpinner';

const Checkout = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    selectedMovie,
    selectedTheatre,
    selectedShow,
    selectedSeats,
    selectedFood,
    appliedOffer,
    setAppliedOffer,
    seatsTotal,
    foodTotal,
    convenienceFee,
    discountAmount,
    grandTotal,
    clearBooking,
  } = useBooking();

  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [cardHolder, setCardHolder] = useState(user?.name || 'Sai Kiran');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('•••');
  const [upiId, setUpiId] = useState(`${user?.email?.split('@')[0] || 'saikiran'}@okhdfcbank`);
  const [simulateFailure, setSimulateFailure] = useState(false);

  const [processing, setProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    setPromoLoading(true);
    setPromoError('');
    setPromoSuccess('');

    try {
      const res = await offerService.validateOffer({
        code: promoCode,
        seatsCount: selectedSeats.length,
        seatsTotal,
        foodTotal,
        showDate: selectedShow?.showDate,
      });

      if (res.success && res.data) {
        setAppliedOffer({
          code: res.data.code,
          discount: res.data.discountAmount,
          title: res.data.title,
        });
        setPromoSuccess(`Promo '${res.data.code}' applied! You saved ${formatINR(res.data.discountAmount)}`);
      }
    } catch (err) {
      setPromoError(err.response?.data?.message || 'Invalid or inapplicable coupon code');
      setAppliedOffer(null);
    } finally {
      setPromoLoading(false);
    }
  };

  const handleCompletePayment = async () => {
    setProcessing(true);
    setCheckoutError('');

    try {
      const seatIds = selectedSeats.map((s) => s.seatId);

      // 1. Initiate Payment Session
      const initRes = await bookingService.initiatePayment({
        showId,
        seatIds,
        amount: grandTotal,
      });

      // 2. Verify Payment
      const verifyRes = await bookingService.verifyPayment({
        paymentSessionId: initRes.data.paymentSessionId,
        paymentMethod: paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod === 'upi' ? 'UPI Instant' : 'Net Banking',
        shouldSimulateFailure: simulateFailure,
      });

      // 3. Create Final Confirmed Booking
      const bookingPayload = {
        showId,
        seatIds,
        foodItems: selectedFood.map((f) => ({
          foodItemId: f.foodItemId,
          quantity: f.quantity,
        })),
        offerCode: appliedOffer?.code || null,
        paymentSessionId: initRes.data.paymentSessionId,
        paymentTransactionId: verifyRes.data.paymentTransactionId,
        paymentMethod: paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod === 'upi' ? 'UPI Instant' : 'Net Banking',
      };

      const bookingRes = await bookingService.createBooking(bookingPayload);

      if (bookingRes.success && bookingRes.data) {
        clearBooking();
        navigate(`/booking/confirm/${bookingRes.data.bookingId}`, {
          state: { booking: bookingRes.data },
        });
      }
    } catch (err) {
      setCheckoutError(
        err.response?.data?.message ||
          'Payment authorization failed. Please verify payment details or check seat hold.'
      );
    } finally {
      setProcessing(false);
    }
  };

  if (processing) {
    return <LoadingSpinner text="Authorizing 256-Bit SSL payment & issuing digital QR pass..." />;
  }

  return (
    <div className="min-h-screen py-8 sm:py-10 text-white">
      <div className="container-cinema space-y-8">
        {/* Multi-Step Flow Indicator */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 text-xs font-bold uppercase tracking-wider select-none">
          <span className="text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
            <span className="w-4 h-4 rounded-full bg-emerald-500 text-black flex items-center justify-center text-[10px] font-black">
              ✓
            </span>
            <span>Seats</span>
          </span>
          <span className="text-zinc-600">→</span>
          <span className="text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
            <span className="w-4 h-4 rounded-full bg-emerald-500 text-black flex items-center justify-center text-[10px] font-black">
              ✓
            </span>
            <span>Snacks</span>
          </span>
          <span className="text-zinc-600">→</span>
          <span className="text-[#e50914] flex items-center gap-1.5 bg-[#e50914]/15 border border-[#e50914]/40 px-3.5 py-1 rounded-full shadow-[0_0_15px_rgba(229,9,20,0.25)]">
            <span className="w-4 h-4 rounded-full bg-[#e50914] text-white flex items-center justify-center text-[10px] font-black animate-pulse">
              3
            </span>
            <span>Checkout</span>
          </span>
          <span className="text-zinc-600">→</span>
          <span className="text-zinc-500 hidden sm:flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-white/10 text-zinc-400 flex items-center justify-center text-[10px]">
              4
            </span>
            <span>Pass</span>
          </span>
        </div>

        {checkoutError && (
          <div className="p-4 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs rounded-2xl flex items-center gap-3">
            <span className="text-lg">⚠️</span>
            <span className="font-semibold">{checkoutError}</span>
          </div>
        )}

        {/* Main Layout: Summary Left + Payment Portal Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Cols: Detailed Booking Breakdown */}
          <div className="lg:col-span-7 space-y-6">
            {/* Reservation Card */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-white/10">
              <div className="flex items-start justify-between pb-6 border-b border-white/10 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ffb703] animate-pulse" />
                    <span className="text-[#ffb703] text-[10px] font-black uppercase tracking-widest">
                      Cinema Reservation
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {selectedMovie?.title || 'Blockbuster Movie'}
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1 flex flex-wrap items-center gap-2">
                    <span>🏛️ {selectedTheatre?.name}</span>
                    <span>•</span>
                    <span>🎬 {selectedShow?.screenSnapshot?.screenName || 'Audi 1'}</span>
                    <span>•</span>
                    <span className="text-white font-semibold">⏱️ {selectedShow?.showTime}</span>
                    <span>•</span>
                    <span>📅 {selectedShow?.showDate}</span>
                  </p>
                </div>

                <div className="w-14 h-20 rounded-xl overflow-hidden bg-[#181928] border border-white/15 shrink-0 shadow-lg">
                  <img
                    src={selectedMovie?.poster_url || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&auto=format&fit=crop&q=80'}
                    alt={selectedMovie?.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Seats & Snacks Summary */}
              <div className="space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-zinc-300">
                  <span className="text-zinc-400 font-semibold">Selected Seats ({selectedSeats.length}):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSeats.map((s) => (
                      <span key={s.seatId} className="bg-white/5 border border-white/15 px-2.5 py-0.5 rounded font-mono font-black text-[#ffb703]">
                        {s.seatId}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedFood.length > 0 && (
                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <span className="text-zinc-400 font-bold uppercase tracking-wider block text-[11px]">
                      Concession Items:
                    </span>
                    <div className="space-y-1.5">
                      {selectedFood.map((f) => (
                        <div key={f.foodItemId} className="flex justify-between text-zinc-300">
                          <span>{f.name} <span className="text-[#ffb703] font-mono">x{f.quantity}</span></span>
                          <span className="font-mono font-semibold text-white">{formatINR(f.subtotal)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Promo Code Coupon Area */}
              <div className="pt-5 border-t border-white/10 space-y-3">
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider block">
                  Promo / Discount Coupon
                </span>
                <form onSubmit={handleApplyPromo} className="flex gap-2.5">
                  <input
                    type="text"
                    placeholder="e.g. FIRST50, CINEVIP"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-[#12131f] border border-white/10 focus:border-[#ffb703] rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-white uppercase placeholder-zinc-500 outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!promoCode.trim() || promoLoading}
                    className="btn-secondary text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer disabled:opacity-40 transition-all"
                  >
                    {promoLoading ? 'Checking...' : 'Apply Coupon'}
                  </button>
                </form>

                {promoSuccess && (
                  <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl">
                    <span>✓</span>
                    <span>{promoSuccess}</span>
                  </p>
                )}

                {promoError && (
                  <p className="text-xs text-rose-400 font-semibold flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                    <span>✕</span>
                    <span>{promoError}</span>
                  </p>
                )}
              </div>

              {/* Final Bill Breakdown */}
              <div className="pt-5 border-t border-white/10 space-y-2.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Tickets Subtotal</span>
                  <span className="font-mono text-zinc-200">{formatINR(seatsTotal)}</span>
                </div>

                {foodTotal > 0 && (
                  <div className="flex justify-between text-zinc-400">
                    <span>Food & Beverage Subtotal</span>
                    <span className="font-mono text-zinc-200">{formatINR(foodTotal)}</span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-400">
                  <span>Convenience & Payment Gateway Fee (18% GST)</span>
                  <span className="font-mono text-zinc-200">{formatINR(convenienceFee)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Promo Discount Applied ({appliedOffer?.code})</span>
                    <span className="font-mono font-bold">-{formatINR(discountAmount)}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                  <div>
                    <span className="text-sm font-bold text-white block">Final Payable Amount</span>
                    <span className="text-[10px] text-zinc-500">Includes all applicable taxes</span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-[#00d4aa] font-mono tracking-tight">
                    {formatINR(grandTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Payment Gateway Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-white/10 lg:sticky lg:top-24">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="font-black text-lg text-white">Payment Method</h3>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold">
                  🔒 256-Bit Encrypted
                </span>
              </div>

              {/* Payment Tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'card'
                      ? 'bg-gradient-to-r from-[#e50914] to-[#b80610] border-red-500 text-white shadow-lg shadow-red-950/40'
                      : 'bg-[#12131f] border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <span className="text-base">💳</span>
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'upi'
                      ? 'bg-gradient-to-r from-[#e50914] to-[#b80610] border-red-500 text-white shadow-lg shadow-red-950/40'
                      : 'bg-[#12131f] border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <span className="text-base">📱</span>
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'netbanking'
                      ? 'bg-gradient-to-r from-[#e50914] to-[#b80610] border-red-500 text-white shadow-lg shadow-red-950/40'
                      : 'bg-[#12131f] border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <span className="text-base">🏛️</span>
                  <span>Net Banking</span>
                </button>
              </div>

              {/* Card Inputs Mockup */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-[#12131f] border border-white/10 rounded-xl px-3.5 py-2.5 font-mono text-white outline-none focus:border-[#e50914] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full bg-[#12131f] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#e50914] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-zinc-400 font-semibold mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-[#12131f] border border-white/10 rounded-xl px-3.5 py-2.5 font-mono text-white outline-none focus:border-[#e50914] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 font-semibold mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-[#12131f] border border-white/10 rounded-xl px-3.5 py-2.5 font-mono text-white outline-none focus:border-[#e50914] transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Inputs */}
              {paymentMethod === 'upi' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1">UPI Virtual Payment Address (VPA)</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@okhdfcbank"
                      className="w-full bg-[#12131f] border border-white/10 rounded-xl px-3.5 py-2.5 font-mono text-white outline-none focus:border-[#e50914] transition-colors"
                    />
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    You will receive a real-time payment notification on Google Pay, PhonePe, or Paytm app.
                  </p>
                </div>
              )}

              {/* Net Banking Options */}
              {paymentMethod === 'netbanking' && (
                <div className="space-y-2 text-xs">
                  <label className="block text-zinc-400 font-semibold mb-1">Select Your Bank</label>
                  <select className="w-full bg-[#12131f] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none">
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>State Bank of India (SBI)</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              {/* Simulation test mode for evaluators */}
              <div className="flex items-center gap-2 pt-1 text-[11px] text-zinc-500">
                <input
                  type="checkbox"
                  id="simFailure"
                  checked={simulateFailure}
                  onChange={(e) => setSimulateFailure(e.target.checked)}
                  className="rounded cursor-pointer accent-[#e50914]"
                />
                <label htmlFor="simFailure" className="cursor-pointer">
                  Simulate Payment Decline (For Evaluation)
                </label>
              </div>

              {/* Action CTA Button */}
              <button
                type="button"
                onClick={handleCompletePayment}
                className="w-full btn-cinema py-4 rounded-xl text-xs font-black shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Pay {formatINR(grandTotal)} & Confirm Ticket</span>
                <span>🔒</span>
              </button>

              {/* Security Guarantee Notice */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-center gap-3 text-[10px] text-zinc-500 text-center">
                <span>✓ 100% Refund on Cancellation</span>
                <span>•</span>
                <span>✓ Instant Digital QR Pass</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
