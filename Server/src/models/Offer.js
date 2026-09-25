import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'flat'],
      default: 'percentage',
    },
    discountValue: {
      type: Number,
      required: true, // e.g. 20 for 20% or 100 for ₹100
    },
    maxDiscount: {
      type: Number,
      default: 200,
    },
    minBookingAmount: {
      type: Number,
      default: 0,
    },
    minSeatsCount: {
      type: Number,
      default: 1,
    },
    applicableOnFoodOnly: {
      type: Boolean,
      default: false,
    },
    firstBookingOnly: {
      type: Boolean,
      default: false,
    },
    validFrom: {
      type: Date,
      default: Date.now,
    },
    validUntil: {
      type: Date,
      default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
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

const Offer = mongoose.model('Offer', offerSchema);
export default Offer;
