import mongoose from "mongoose";

const notificationActivitySchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["notification", "activity"],
            required: true
        },

        action: {
            type: String,
            required: true
        },

        message: {
            type: String,
            required: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        meta: {
            type: Object,
            default: {}
        }
    },
    { timestamps: true }
);

export default mongoose.model("NotificationActivity", notificationActivitySchema);
