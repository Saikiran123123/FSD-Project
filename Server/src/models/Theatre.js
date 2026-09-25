import mongoose from 'mongoose';

const theatreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    chain: {
      type: String,
      default: 'CineBook Premium',
    },
    city: {
      type: String,
      required: true,
      index: true,
    },
    area: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    facilities: {
      type: [String],
      default: ['Dolby Atmos', 'Recliner Seats', '4K Laser Projection', 'Food Court', 'Valet Parking', 'Wheelchair Accessible'],
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Theatre = mongoose.model('Theatre', theatreSchema);
export default Theatre;
