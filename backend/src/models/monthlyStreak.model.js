import mongoose from "mongoose";

const weeklySchema = new mongoose.Schema({
    weekLabel: String,
    weekStart: Date,
    weekEnd: Date,
    cardsSent: Number,
    streakEarned: Boolean
});

const monthlyStreakSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    monthKey: { type: String, required: true },
    // example: "2025-12"

    monthLabel: { type: String },
    // example: "December 2025"

    currentStreak: Number,
    bestStreak: Number,
    totalCardsThisMonth: Number,

    weeks: [weeklySchema]

}, { timestamps: true });

monthlyStreakSchema.index({ student: 1, monthKey: 1 }, { unique: true });

export const MonthlyStreak = mongoose.model("MonthlyStreak", monthlyStreakSchema);
