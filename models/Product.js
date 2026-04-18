import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, "Please provide a valid product URL"],
      unique: true,
      trim: true,
    },
    platform: {
      type: String,
      required: true,
      enum: ["Amazon", "Flipkart", "Meesho", "Ajio", "Unknown"],
    },
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    currentPrice: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
    },
    trackedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    trackingCount: {
      type: Number,
      default: 1,
    },
    lastChecked: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
