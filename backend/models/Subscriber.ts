import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    isActive: {
      type: Boolean,
      default: true, // Future-proofing for double opt-in feature
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

export const Subscriber = mongoose.models.Subscriber || mongoose.model("Subscriber", subscriberSchema);
