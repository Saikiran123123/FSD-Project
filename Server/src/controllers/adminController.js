import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Show from '../models/Show.js';
import Theatre from '../models/Theatre.js';

export const getAdminDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalTheatres = await Theatre.countDocuments();
    const totalShows = await Show.countDocuments({ isActive: true });
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ bookingStatus: 'confirmed' });

    // Aggregate total revenue
    const revenueResult = await Booking.aggregate([
      { $match: { bookingStatus: 'confirmed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$pricing.grandTotal' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Recent 10 bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('bookingId userName userEmail movieSnapshot pricing bookingStatus createdAt');

    // Revenue by movie
    const topMovies = await Booking.aggregate([
      { $match: { bookingStatus: 'confirmed' } },
      {
        $group: {
          _id: '$movieSnapshot.title',
          bookingsCount: { $sum: 1 },
          totalSales: { $sum: '$pricing.grandTotal' },
        },
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalTheatres,
        totalShows,
        totalBookings,
        confirmedBookings,
        totalRevenue,
        recentBookings,
        topMovies,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
