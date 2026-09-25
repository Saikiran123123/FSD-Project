import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema(
  {
    seatId: {
      type: String,
      required: true, // e.g. 'A1', 'C4', 'H10'
    },
    row: {
      type: String,
      required: true, // 'A', 'B', etc.
    },
    number: {
      type: Number,
      required: true, // 1, 2, 3...
    },
    category: {
      type: String,
      enum: ['Silver', 'Gold', 'VIP Recliner'],
      default: 'Gold',
    },
    price: {
      type: Number,
      required: true,
      default: 250,
    },
    status: {
      type: String,
      enum: ['available', 'held', 'booked'],
      default: 'available',
      index: true,
    },
    heldBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    heldUntil: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const showSchema = new mongoose.Schema(
  {
    tmdbMovieId: {
      type: Number,
      required: true,
      index: true,
    },
    movieTitle: {
      type: String,
      required: true,
    },
    moviePoster: String,
    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: true,
      index: true,
    },
    screenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Screen',
      required: true,
    },
    screenName: {
      type: String,
      default: 'Audi 1',
    },
    format: {
      type: String,
      enum: ['2D', '3D', 'IMAX 3D', '4DX'],
      default: '2D',
    },
    language: {
      type: String,
      default: 'English',
    },
    showDate: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true,
    },
    startTime: {
      type: String, // e.g. "10:30 AM", "02:15 PM", "06:45 PM", "10:00 PM"
      required: true,
    },
    endTime: {
      type: String,
      default: '',
    },
    basePrice: {
      type: Number,
      default: 250,
    },
    seats: [seatSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for demand occupancy calculation
showSchema.virtual('occupancyPercentage').get(function () {
  if (!this.seats || this.seats.length === 0) return 0;
  const occupiedCount = this.seats.filter(
    (s) => s.status === 'booked' || (s.status === 'held' && s.heldUntil > new Date())
  ).length;
  return Math.round((occupiedCount / this.seats.length) * 100);
});

showSchema.set('toJSON', { virtuals: true });
showSchema.set('toObject', { virtuals: true });

const Show = mongoose.model('Show', showSchema);
export default Show;
