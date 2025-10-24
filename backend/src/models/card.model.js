import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    recipient_name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["card", "flower", "coffee", "pizza"],
      default: "card",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Card", cardSchema);
