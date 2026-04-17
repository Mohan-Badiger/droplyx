import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    targetPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "triggered", "disabled"],
      default: "active",
    },
  },
  { timestamps: true }
);

// A user should only have one active alert per product at a time
AlertSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.models.Alert || mongoose.model("Alert", AlertSchema);
