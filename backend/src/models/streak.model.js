import mongoose from "mongoose";

const streakSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    currentStreak: {
        type: Number,
        default: 0
    },

    bestStreak: {
        type: Number,
        default: 0
    },

    lastUpdatedWeek: {
        type: String, // Example: "2025-W10"
        required: true
    }
}, { timestamps: true });

streakSchema.index({ student: 1 }, { unique: true });

export const Streak = mongoose.model("Streak", streakSchema);
