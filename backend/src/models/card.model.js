import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },

    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: false,
      default: null,
    },

    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
    },

    reward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reward",
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    recipient_email: {
      type: String,
      required: true
    },

    recipient_name: {
      type: String,
      required: true,
      trim: true,
    },

    sent_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Card", cardSchema);
