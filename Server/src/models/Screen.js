import mongoose from 'mongoose';

const screenSchema = new mongoose.Schema(
  {
    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: true,
      index: true,
    },
    screenNumber: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      default: 'Audi 1',
    },
    soundSystem: {
      type: String,
      default: 'Dolby Atmos 7.1',
    },
    projectionType: {
      type: String,
      enum: ['2D', '3D', 'IMAX 3D', '4DX', 'Laser 4K'],
      default: 'Laser 4K',
    },
    totalSeats: {
      type: Number,
      default: 80,
    },
    layout: {
      rows: { type: Number, default: 8 },
      cols: { type: Number, default: 10 },
      categories: [
        {
          name: { type: String, enum: ['Silver', 'Gold', 'VIP Recliner'], default: 'Gold' },
          rows: [String], // e.g. ['A', 'B']
          price: { type: Number, default: 250 },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Screen = mongoose.model('Screen', screenSchema);
export default Screen;
