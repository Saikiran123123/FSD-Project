import { tmdbService } from './tmdbService.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

export const recommendationService = {
  // 1. Personalized Movie Recommendations
  async getMovieRecommendations(userId) {
    let preferredGenres = ['Action', 'Sci-Fi', 'Adventure'];
    let bookedMovieIds = [];

    if (userId) {
      const user = await User.findById(userId);
      if (user && user.favoriteGenres && user.favoriteGenres.length > 0) {
        preferredGenres = user.favoriteGenres;
      }
      const bookings = await Booking.find({ userId }).select('tmdbMovieId');
      bookedMovieIds = bookings.map((b) => b.tmdbMovieId);
    }

    const { results: candidateMovies } = await tmdbService.getPopular(1);

    // Score candidates
    const scored = candidateMovies.map((movie) => {
      let score = 0;
      const movieGenres = (movie.genres || []).map((g) => (typeof g === 'string' ? g : g.name));

      // Match favorite genres (+3 per match)
      movieGenres.forEach((g) => {
        if (preferredGenres.includes(g)) score += 3;
      });

      // High rating bonus (+2)
      if (movie.vote_average >= 7.5) score += 2;

      // Penalize already booked (-5)
      if (bookedMovieIds.includes(movie.id)) score -= 5;

      return {
        ...movie,
        matchScore: score,
        recommendationReason:
          score >= 5
            ? 'Matches your favorite genres & highly rated'
            : 'Popular trending in theatres',
      };
    });

    return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 8);
  },

  // 2. Smart Seat Recommendation (Center rows & columns)
  getSmartSeats(seats, count = 2, preferredCategory = 'Gold') {
    const availableSeats = seats.filter(
      (s) => s.status === 'available' && (!preferredCategory || s.category === preferredCategory)
    );

    // Score seats based on viewing angle & distance to center
    const scoredSeats = availableSeats.map((seat) => {
      let score = 10;

      // Optimal rows: D, E, F (Middle rows)
      if (['D', 'E', 'F'].includes(seat.row)) score += 5;
      else if (['C', 'G'].includes(seat.row)) score += 3;
      else if (['A', 'B'].includes(seat.row)) score -= 3; // Front rows

      // Optimal columns: 4, 5, 6, 7 (Center of 10-column screen)
      if ([4, 5, 6, 7].includes(seat.number)) score += 6;
      else if ([3, 8].includes(seat.number)) score += 3;
      else score -= 2; // Far side edges

      if (seat.category === 'VIP Recliner') score += 4;

      return {
        ...seat.toObject ? seat.toObject() : seat,
        score,
        isBestPick: score >= 18,
      };
    });

    return scoredSeats.sort((a, b) => b.score - a.score).slice(0, count);
  },

  // 3. Group Booking Run Finder (finds N contiguous seats)
  findGroupSeats(seats, groupSize = 4, category = 'Gold') {
    const byRow = {};
    seats.forEach((s) => {
      if (category && s.category !== category) return;
      if (!byRow[s.row]) byRow[s.row] = [];
      byRow[s.row].push(s);
    });

    const candidates = [];

    Object.keys(byRow).forEach((rowKey) => {
      const rowSeats = byRow[rowKey].sort((a, b) => a.number - b.number);
      for (let i = 0; i <= rowSeats.length - groupSize; i++) {
        const slice = rowSeats.slice(i, i + groupSize);
        // Verify all seats in slice are contiguous numbers and available
        let contiguous = true;
        for (let j = 0; j < slice.length; j++) {
          if (slice[j].status !== 'available') {
            contiguous = false;
            break;
          }
          if (j > 0 && slice[j].number !== slice[j - 1].number + 1) {
            contiguous = false;
            break;
          }
        }

        if (contiguous) {
          // Calculate average center score
          const avgNumber = slice.reduce((sum, s) => sum + s.number, 0) / groupSize;
          const centerDist = Math.abs(5.5 - avgNumber);
          const score = 100 - centerDist * 10 + (['D', 'E', 'F'].includes(rowKey) ? 20 : 0);
          candidates.push({
            row: rowKey,
            seats: slice.map((s) => s.seatId),
            seatObjects: slice,
            score,
          });
        }
      }
    });

    return candidates.sort((a, b) => b.score - a.score).slice(0, 3);
  },
};
