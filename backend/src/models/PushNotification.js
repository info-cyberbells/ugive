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

        isActive: {
            type: Boolean,
            default: true,
        },

        universityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "University",
            required: true,
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
