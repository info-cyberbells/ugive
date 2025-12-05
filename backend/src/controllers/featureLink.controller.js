import { FeatureLink } from "../models/featureLink.model.js";

// CREATE
export const createFeatureLink = async (req, res) => {
    try {
        const { name, link } = req.body;

        if (!name || !link) {
            return res.status(400).json({ message: "Name and link are required." });
        }

        // File comes from multer
        const icon = req.file ? "/" + req.file.path.replace(/\\/g, "/") : null;

        if (!icon) {
            return res.status(400).json({ message: "Icon image is required." });
        }

        const feature = await FeatureLink.create({
            name,
            link,
            icon,
        });

        res.status(201).json({
            message: "Feature created successfully",
            data: feature,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// GET ALL
export const getAllFeatureLinks = async (req, res) => {
    try {
        const features = await FeatureLink.find().sort({ createdAt: -1 });

        const baseUrl = `${req.protocol}://${req.headers.host}`;

        const updatedFeatures = features.map((f) => ({
            ...f._doc,
            icon: f.icon ? `${baseUrl}${f.icon}` : null,
        }));

        res.status(200).json({
            message: "Features retrieved successfully",
            data: updatedFeatures,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// UPDATE
export const updateFeatureLink = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, link } = req.body;

        const updateData = { name, link };

        // If new icon uploaded → update
        if (req.file) {
            updateData.icon = "/" + req.file.path.replace(/\\/g, "/");
        }

        const updated = await FeatureLink.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        if (!updated) {
            return res.status(404).json({ message: "Feature not found" });
        }

        res.status(200).json({
            message: "Feature updated successfully",
            data: updated,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// DELETE
export const deleteFeatureLink = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await FeatureLink.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: "Feature not found" });
        }

        res.status(200).json({
            message: "Feature deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

