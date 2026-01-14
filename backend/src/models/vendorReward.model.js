import mongoose from "mongoose";

const vendorRewardSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            trim: true,
            default: null
        },

        rewardImage: {
            type: String,
            default: null
        },

        // vendor: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "User",
        //     required: true
        // },

        university: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "University",
            required: true
        },

        isActive: {
            type: Boolean,
            default: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true }
);

export default mongoose.model("VendorReward", vendorRewardSchema);
