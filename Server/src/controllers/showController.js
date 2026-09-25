import mongoose from 'mongoose';
import Show from '../models/Show.js';
import Theatre from '../models/Theatre.js';
import Screen from '../models/Screen.js';
import { recommendationService } from '../services/recommendationService.js';

// Helper to generate default 80-seat layout for a screen
export const generateDefaultSeats = (basePrice = 250) => {
  const seats = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  rows.forEach((row) => {
    for (let num = 1; num <= 10; num++) {
      let category = 'Gold';
      let price = basePrice;

      if (['A', 'B'].includes(row)) {
        category = 'Silver';
        price = Math.round(basePrice * 0.8);
      } else if (['G', 'H'].includes(row)) {
        category = 'VIP Recliner';
        price = Math.round(basePrice * 1.5);
      }

      seats.push({
        seatId: `${row}${num}`,
        row,
        number: num,
        category,
        price,
        status: 'available',
        heldBy: null,
        heldUntil: null,
      });
    }
  });
  return seats;
};

// @desc    Get shows for a specific movie (filtered by city/date)
// @route   GET /api/shows/movie/:tmdbId
// @access  Public
export const getShowsByMovie = async (req, res) => {
  try {
    const tmdbId = Number(req.params.tmdbId);
    const { date, city } = req.query;

    const filter = { tmdbMovieId: tmdbId, isActive: true };
    if (date) {
      filter.showDate = date;
    }

    const shows = await Show.find(filter).populate('theatreId').populate('screenId');

    // Filter by city if specified
    const filteredShows = city
      ? shows.filter((s) => s.theatreId && s.theatreId.city.toLowerCase() === city.toLowerCase())
      : shows;

    // Format response grouped by theatre
    const theatreMap = {};
    filteredShows.forEach((show) => {
      const theatre = show.theatreId;
      if (!theatre) return;
      const tId = theatre._id.toString();
      if (!theatreMap[tId]) {
        theatreMap[tId] = {
          theatre: {
            _id: theatre._id,
            name: theatre.name,
            address: theatre.address,
            area: theatre.area,
            city: theatre.city,
            facilities: theatre.facilities,
          },
          shows: [],
        };
      }
      theatreMap[tId].shows.push({
        _id: show._id,
        showDate: show.showDate,
        startTime: show.startTime,
        format: show.format,
        language: show.language,
        basePrice: show.basePrice,
        occupancyPercentage: show.occupancyPercentage,
        screenName: show.screenName,
      });
    });

    res.json({
      success: true,
      count: filteredShows.length,
      data: Object.values(theatreMap),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get seat status for a show
// @route   GET /api/shows/:id/seats
// @access  Public
export const getShowSeats = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id).populate('theatreId screenId');
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    // Refresh expired held seats in memory view
    const now = new Date();
    const formattedSeats = show.seats.map((s) => {
      const isExpired = s.status === 'held' && s.heldUntil && s.heldUntil < now;
      return {
        seatId: s.seatId,
        row: s.row,
        number: s.number,
        category: s.category,
        price: s.price,
        status: isExpired ? 'available' : s.status,
      };
    });

    res.json({
      success: true,
      data: {
        showId: show._id,
        movieTitle: show.movieTitle,
        theatre: show.theatreId,
        screenName: show.screenName,
        format: show.format,
        language: show.language,
        showDate: show.showDate,
        startTime: show.startTime,
        basePrice: show.basePrice,
        occupancyPercentage: show.occupancyPercentage,
        seats: formattedSeats,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Hold seats temporarily (5-minute lock with atomic update)
// @route   POST /api/shows/:id/hold-seats
// @access  Private
export const holdSeats = async (req, res) => {
  try {
    const { seatIds } = req.body;
    const showId = req.params.id;
    const userId = req.user._id;

    if (!seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide seat IDs to hold' });
    }

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    const now = new Date();
    const holdDurationMs = 5 * 60 * 1000; // 5 minutes
    const heldUntil = new Date(Date.now() + holdDurationMs);

    // Validate that all requested seats are currently available or held by the same user
    const unavailableSeats = [];
    seatIds.forEach((sid) => {
      const seat = show.seats.find((s) => s.seatId === sid);
      if (!seat) {
        unavailableSeats.push(sid);
      } else if (seat.status === 'booked') {
        unavailableSeats.push(sid);
      } else if (
        seat.status === 'held' &&
        seat.heldUntil > now &&
        seat.heldBy &&
        seat.heldBy.toString() !== userId.toString()
      ) {
        unavailableSeats.push(sid);
      }
    });

    if (unavailableSeats.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Seats [${unavailableSeats.join(', ')}] are already occupied or held by another guest`,
        unavailableSeats,
      });
    }

    // Atomic update in MongoDB
    seatIds.forEach((sid) => {
      const seat = show.seats.find((s) => s.seatId === sid);
      if (seat) {
        seat.status = 'held';
        seat.heldBy = userId;
        seat.heldUntil = heldUntil;
      }
    });

    await show.save();

    res.json({
      success: true,
      message: `${seatIds.length} seat(s) held successfully for 5 minutes`,
      data: {
        showId: show._id,
        heldSeats: seatIds,
        heldUntil,
        expiresInSeconds: 300,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Release held seats
// @route   POST /api/shows/:id/release-seats
// @access  Private
export const releaseSeats = async (req, res) => {
  try {
    const { seatIds } = req.body;
    const showId = req.params.id;
    const userId = req.user._id;

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    show.seats.forEach((seat) => {
      if (
        (!seatIds || seatIds.includes(seat.seatId)) &&
        seat.status === 'held' &&
        seat.heldBy &&
        seat.heldBy.toString() === userId.toString()
      ) {
        seat.status = 'available';
        seat.heldBy = null;
        seat.heldUntil = null;
      }
    });

    await show.save();

    res.json({
      success: true,
      message: 'Seats released successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Smart Seat recommendations for a show
// @route   GET /api/shows/:id/smart-seats
// @access  Public
export const getSmartSeatRecommendations = async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 2;
    const category = req.query.category || 'Gold';
    const show = await Show.findById(req.params.id);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    const smartSeats = recommendationService.getSmartSeats(show.seats, count, category);
    res.json({ success: true, data: smartSeats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Find contiguous group seats
// @route   GET /api/shows/:id/group-seats
// @access  Public
export const getGroupSeatRecommendations = async (req, res) => {
  try {
    const groupSize = parseInt(req.query.size) || 4;
    const category = req.query.category || 'Gold';
    const show = await Show.findById(req.params.id);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    const runs = recommendationService.findGroupSeats(show.seats, groupSize, category);
    res.json({ success: true, data: runs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new show (Admin)
// @route   POST /api/shows
// @access  Private/Admin
export const createShow = async (req, res) => {
  try {
    const { tmdbMovieId, movieTitle, moviePoster, theatreId, screenId, screenName, format, language, showDate, startTime, basePath } = req.body;
    const basePrice = req.body.basePrice || 250;
    const seats = generateDefaultSeats(basePrice);

    const show = await Show.create({
      tmdbMovieId,
      movieTitle,
      moviePoster,
      theatreId,
      screenId,
      screenName: screenName || 'Audi 1',
      format: format || '2D',
      language: language || 'English',
      showDate,
      startTime,
      basePrice,
      seats,
    });

    res.status(201).json({ success: true, data: show });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
