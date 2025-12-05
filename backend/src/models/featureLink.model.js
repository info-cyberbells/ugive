import mongoose from "mongoose";

const featureLinkSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const FeatureLink = mongoose.model("FeatureLink", featureLinkSchema);
