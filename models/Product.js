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
      enum: ["Amazon", "Flipkart", "Meesho", "Ajio", "Reliance Digital", "Unknown"],
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

// Handle potential enum caching issues in development
if (mongoose.models.Product) {
  const enumValues = mongoose.models.Product.schema.path("platform").enumValues;
  if (!enumValues.includes("Reliance Digital")) {
    delete mongoose.models.Product;
  }
}

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
