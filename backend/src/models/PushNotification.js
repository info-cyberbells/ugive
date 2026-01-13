import mongoose from "mongoose";

const pushNotificationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },

        type: {
            type: String,
            enum: ["CARD_DROP"],
            default: "CARD_DROP",
        },

        targetRole: {
            type: String,
            enum: ["student"],
            default: "student",
        },

        scheduledAt: {
            type: Date,
            default: null,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("PushNotification", pushNotificationSchema);
