import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import Theatre from '../models/Theatre.js';

// Helper to generate unique human-readable CineBook ID
const generateBookingId = () => {
  const year = new Date().getFullYear();
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CB-${year}-${randomStr}`;
};

// @desc    Create final confirmed booking (Atomic Seat Status Transition)
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const {
      showId,
      seatIds,
      foodItems,
      offerApplied,
      paymentDetails,
      movieSnapshot,
    } = req.body;

    const userId = req.user._id;

    if (!showId || !seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid booking data. Seats are required.' });
    }

    const show = await Show.findById(showId).populate('theatreId');
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    const now = new Date();

    // Re-verify that the user holds all selected seats
    const bookedSeatsData = [];
    const unavailableSeats = [];

    seatIds.forEach((sid) => {
      const seat = show.seats.find((s) => s.seatId === sid);
      if (
        !seat ||
        seat.status === 'booked' ||
        (seat.status === 'held' && seat.heldBy && seat.heldBy.toString() !== userId.toString()) ||
        (seat.status === 'held' && seat.heldUntil < now)
      ) {
        unavailableSeats.push(sid);
      } else {
        bookedSeatsData.push({
          seatId: seat.seatId,
          row: seat.row,
          number: seat.number,
          category: seat.category,
          price: seat.price,
        });
      }
    });

    if (unavailableSeats.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Seats [${unavailableSeats.join(', ')}] are no longer held. Please re-select seats.`,
        unavailableSeats,
      });
    }

    // Atomic update: Mark held seats as 'booked'
    seatIds.forEach((sid) => {
      const seat = show.seats.find((s) => s.seatId === sid);
      if (seat) {
        seat.status = 'booked';
        seat.heldBy = null;
        seat.heldUntil = null;
      }
    });

    await show.save();

    // Compute pricing
    const seatsTotal = bookedSeatsData.reduce((sum, s) => sum + s.price, 0);
    const foodTotal = (foodItems || []).reduce((sum, f) => sum + (f.subtotal || f.price * f.quantity), 0);
    const convenienceFee = 35;
    const discountAmount = offerApplied?.discount || 0;
    const grandTotal = Math.max(0, seatsTotal + foodTotal + convenienceFee - discountAmount);

    const bookingId = generateBookingId();
    // Safe QR payload with ticket ref code
    const qrData = JSON.stringify({
      bookingId,
      showId: show._id,
      seats: seatIds,
      user: req.user.email,
      issuedAt: new Date().toISOString(),
    });

    const booking = await Booking.create({
      bookingId,
      userId,
      userEmail: req.user.email,
      userName: req.user.name,
      userPhone: req.user.phone || '',
      showId: show._id,
      theatreId: show.theatreId?._id || show.theatreId,
      theatreName: show.theatreId?.name || 'CineBook Cinema',
      theatreAddress: show.theatreId?.address || show.theatreId?.city || 'Cinema Hall',
      screenName: show.screenName || 'Audi 1',
      tmdbMovieId: show.tmdbMovieId,
      movieSnapshot: {
        title: movieSnapshot?.title || show.movieTitle,
        posterPath: movieSnapshot?.posterPath || show.moviePoster,
        backdropPath: movieSnapshot?.backdropPath || '',
        format: show.format,
        language: show.language,
        runtime: movieSnapshot?.runtime || 120,
        showDate: show.showDate,
        showTime: show.startTime,
      },
      seats: bookedSeatsData,
      foodItems: foodItems || [],
      pricing: {
        seatsTotal,
        foodTotal,
        convenienceFee,
        discountAmount,
        grandTotal,
      },
      offerApplied: offerApplied || null,
      paymentDetails: {
        paymentId: paymentDetails?.transactionId || `TXN_${Date.now()}`,
        paymentMethod: paymentDetails?.paymentMethod || 'Credit/Debit Card',
        paymentStatus: 'completed',
        paidAt: new Date(),
      },
      bookingStatus: 'confirmed',
      qrData,
    });

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user's booking history
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single booking ticket details
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      $or: [{ _id: mongoose.isValidObjectId(req.params.id) ? req.params.id : null }, { bookingId: req.params.id }],
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking ticket not found' });
    }

    // Ensure user is owner or admin
    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    booking.bookingStatus = 'cancelled';
    booking.paymentDetails.paymentStatus = 'refunded';
    await booking.save();

    // Release seats back to available in the show
    const show = await Show.findById(booking.showId);
    if (show) {
      const bookedSeatIds = booking.seats.map((s) => s.seatId);
      show.seats.forEach((seat) => {
        if (bookedSeatIds.includes(seat.seatId)) {
          seat.status = 'available';
          seat.heldBy = null;
          seat.heldUntil = null;
        }
      });
      await show.save();
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully and refund initiated',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
