import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        university: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "University",
            required: true,
        },

        college: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "College",
            required: false,
        },

        rewardDescription: {
            type: String,
            required: true,
        },
        rewardImage: {
            type: String,
            default: null
        },
        totalPoints: {
            type: Number,
            required: true,
            min: 0,
        },

        completedPoints: {
            type: Number,
            default: 0,
            min: 0
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

export const Reward = mongoose.model("Reward", rewardSchema);
