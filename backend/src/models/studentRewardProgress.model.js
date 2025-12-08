import mongoose from "mongoose";

const studentRewardProgressSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    reward: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reward",
        required: true
    },

    completedPoints: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

studentRewardProgressSchema.index({ student: 1, reward: 1 }, { unique: true });

export const StudentRewardProgress = mongoose.model(
    "StudentRewardProgress",
    studentRewardProgressSchema
);
