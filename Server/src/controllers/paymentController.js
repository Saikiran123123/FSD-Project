import Show from '../models/Show.js';

// @desc    Initiate mock payment session & verify seat validity
// @route   POST /api/payment/initiate
// @access  Private
export const initiatePayment = async (req, res) => {
  try {
    const { showId, seatIds, amount } = req.body;
    const userId = req.user._id;

    if (!showId || !seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid payment initiation parameters' });
    }

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    const now = new Date();
    // Verify user still holds all requested seats
    const invalidSeats = [];
    seatIds.forEach((sid) => {
      const seat = show.seats.find((s) => s.seatId === sid);
      if (!seat || seat.status !== 'held' || seat.heldUntil < now || !seat.heldBy || seat.heldBy.toString() !== userId.toString()) {
        invalidSeats.push(sid);
      }
    });

    if (invalidSeats.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Your reservation for seats [${invalidSeats.join(', ')}] has expired. Please re-select your seats.`,
        expiredSeats: invalidSeats,
      });
    }

    // Mock payment transaction session token
    const paymentSessionId = `PAY_SESS_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    res.json({
      success: true,
      message: 'Payment session initialized',
      data: {
        paymentSessionId,
        amount,
        currency: 'INR',
        validForSeconds: 300,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mock verify and execute payment
// @route   POST /api/payment/verify
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    const { paymentSessionId, paymentMethod, shouldSimulateFailure } = req.body;

    if (shouldSimulateFailure) {
      return res.status(400).json({
        success: false,
        message: 'Payment declined by issuing bank (Simulated Test Failure)',
      });
    }

    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: {
        transactionId,
        paymentStatus: 'completed',
        paymentMethod: paymentMethod || 'Credit/Debit Card',
        timestamp: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
