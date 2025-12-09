import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null
    },

    reward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reward",
      required: false,
      default: null
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

    college_name: {
      type: String,
      required: false,
      default: null,
      trim: true
    },

    sent_at: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Card", cardSchema);
