import mongoose from 'mongoose';

const bookedSeatSchema = new mongoose.Schema(
  {
    seatId: { type: String, required: true },
    row: { type: String, required: true },
    number: { type: Number, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const bookedFoodSchema = new mongoose.Schema(
  {
    foodItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userEmail: String,
    userName: String,
    userPhone: String,
    showId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show',
      required: true,
    },
    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: true,
    },
    theatreName: String,
    theatreAddress: String,
    screenName: String,
    tmdbMovieId: {
      type: Number,
      required: true,
      index: true,
    },
    movieSnapshot: {
      title: { type: String, required: true },
      posterPath: String,
      backdropPath: String,
      format: String,
      language: String,
      runtime: Number,
      showDate: String,
      showTime: String,
    },
    seats: [bookedSeatSchema],
    foodItems: [bookedFoodSchema],
    pricing: {
      seatsTotal: { type: Number, required: true },
      foodTotal: { type: Number, default: 0 },
      convenienceFee: { type: Number, default: 35 },
      discountAmount: { type: Number, default: 0 },
      grandTotal: { type: Number, required: true },
    },
    offerApplied: {
      code: String,
      discount: Number,
    },
    paymentDetails: {
      paymentId: String,
      paymentMethod: { type: String, default: 'Mock Credit Card / UPI' },
      paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'completed',
      },
      paidAt: { type: Date, default: Date.now },
    },
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'cancelled', 'attended'],
      default: 'confirmed',
      index: true,
    },
    qrData: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
