import Offer from '../models/Offer.js';
import Booking from '../models/Booking.js';

// @desc    Get all active offers
// @route   GET /api/offers
// @access  Public
export const getActiveOffers = async (req, res) => {
  try {
    const offers = await Offer.find({
      isActive: true,
      validUntil: { $gte: new Date() },
    }).sort({ discountValue: -1 });
    res.json({ success: true, count: offers.length, data: offers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Validate offer coupon code
// @route   POST /api/offers/validate
// @access  Private
export const validateOffer = async (req, res) => {
  try {
    const { code, seatsCount, seatsTotal, foodTotal, showDate } = req.body;
    const userId = req.user._id;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }

    const offer = await Offer.findOne({
      code: code.trim().toUpperCase(),
      isActive: true,
      validUntil: { $gte: new Date() },
    });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or expired promo code',
      });
    }

    const totalBookingAmount = (seatsTotal || 0) + (foodTotal || 0);

    // 1. Min Booking Amount check
    if (offer.minBookingAmount > 0 && totalBookingAmount < offer.minBookingAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum booking amount of ₹${offer.minBookingAmount} required for this offer`,
      });
    }

    // 2. Min Seats check
    if (offer.minSeatsCount > 1 && (seatsCount || 1) < offer.minSeatsCount) {
      return res.status(400).json({
        success: false,
        message: `Minimum ${offer.minSeatsCount} seats required for this offer`,
      });
    }

    // 3. First booking only check
    if (offer.firstBookingOnly) {
      const pastBookings = await Booking.countDocuments({
        userId,
        bookingStatus: { $ne: 'cancelled' },
      });
      if (pastBookings > 0) {
        return res.status(400).json({
          success: false,
          message: 'This offer is only valid on your first movie booking with CineBook',
        });
      }
    }

    // 4. Calculate discount
    let discount = 0;
    const baseForDiscount = offer.applicableOnFoodOnly ? (foodTotal || 0) : totalBookingAmount;

    if (offer.discountType === 'flat') {
      discount = offer.discountValue;
    } else {
      discount = (baseForDiscount * offer.discountValue) / 100;
      if (offer.maxDiscount > 0 && discount > offer.maxDiscount) {
        discount = offer.maxDiscount;
      }
    }

    discount = Math.min(discount, totalBookingAmount);

    res.json({
      success: true,
      message: `Coupon '${offer.code}' applied successfully!`,
      data: {
        code: offer.code,
        title: offer.title,
        discountAmount: Math.round(discount),
        finalDiscount: Math.round(discount),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new offer (Admin)
// @route   POST /api/offers
// @access  Private/Admin
export const createOffer = async (req, res) => {
  try {
    const offer = await Offer.create(req.body);
    res.status(201).json({ success: true, data: offer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
