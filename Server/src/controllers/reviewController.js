import Review from '../models/Review.js';
import Booking from '../models/Booking.js';

// @desc    Get reviews for a movie or theatre
// @route   GET /api/reviews
// @access  Public
export const getReviews = async (req, res) => {
  try {
    const { targetType, tmdbMovieId, theatreId } = req.query;
    const filter = {};

    if (targetType) filter.targetType = targetType;
    if (tmdbMovieId) filter.tmdbMovieId = Number(tmdbMovieId);
    if (theatreId) filter.theatreId = theatreId;

    const reviews = await Review.find(filter).sort({ createdAt: -1 });

    // Calculate average rating
    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    res.json({
      success: true,
      count: reviews.length,
      averageRating: Number(avgRating),
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a review (with verified-booking gate for movies)
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { targetType, tmdbMovieId, theatreId, rating, title, comment } = req.body;
    const userId = req.user._id;

    if (!targetType || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide targetType, rating, and comment' });
    }

    let isVerifiedPurchase = false;

    if (targetType === 'movie' && tmdbMovieId) {
      const pastBooking = await Booking.findOne({
        userId,
        tmdbMovieId: Number(tmdbMovieId),
        bookingStatus: 'confirmed',
      });
      if (pastBooking) {
        isVerifiedPurchase = true;
      }
    }

    const review = await Review.create({
      userId,
      userName: req.user.name,
      userAvatar: req.user.avatar || '',
      targetType,
      tmdbMovieId: tmdbMovieId ? Number(tmdbMovieId) : null,
      theatreId: theatreId || null,
      rating: Number(rating),
      title: title || '',
      comment,
      isVerifiedPurchase,
    });

    res.status(201).json({
      success: true,
      message: 'Review posted successfully!',
      data: review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Like a review
// @route   POST /api/reviews/:id/like
// @access  Public
export const likeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    review.likesCount += 1;
    await review.save();
    res.json({ success: true, likesCount: review.likesCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
