import mongoose from "mongoose";

const PriceHistorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index to easily fetch history by product in date order
PriceHistorySchema.index({ product: 1, date: -1 });

export default mongoose.models.PriceHistory ||
  mongoose.model("PriceHistory", PriceHistorySchema);
