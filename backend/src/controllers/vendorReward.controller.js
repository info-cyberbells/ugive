import VendorReward from "../models/vendorReward.model.js";

export const createVendorReward = async (req, res) => {
    try {
        const { name, description, university } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Reward name is required"
            });
        }

        let universityId;

        if (req.user.role === "admin") {
            universityId = req.user.university;
        }

        if (req.user.role === "super_admin" || req.user.role === "superadmin") {
            if (!university) {
                return res.status(400).json({
                    success: false,
                    message: "University is required for superadmin"
                });
            }
            universityId = university;
        }

        const rewardImage = req.file
            ? `/uploads/profile-images/${req.file.filename}`
            : null;

        const reward = await VendorReward.create({
            name,
            description,
            rewardImage,
            university: universityId,
            createdBy: req.user.id
        });

        return res.status(201).json({
            success: true,
            message: "Reward created successfully",
            data: reward
        });

    } catch (error) {
        console.error("Create vendor reward error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const getVendorRewards = async (req, res) => {
    try {
        const baseURL = `${req.protocol}://${req.get("host")}`;

        let { page = 1, limit = 10 } = req.query;
        page = Math.max(1, parseInt(page));
        limit = Math.min(50, Math.max(1, parseInt(limit)));

        const skip = (page - 1) * limit;

        let query = { isActive: true };

        if (req.user.role === "admin") {
            query.university = req.user.university;
        }

        const total = await VendorReward.countDocuments(query);

        const rewards = await VendorReward.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const formatted = rewards.map(r => ({
            ...r.toObject(),
            rewardImage: r.rewardImage ? `${baseURL}${r.rewardImage}` : null
        }));

        return res.status(200).json({
            success: true,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            data: formatted
        });

    } catch (error) {
        console.error("Get rewards error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


export const getSingleVendorReward = async (req, res) => {
    try {
        const { id } = req.params;
        const baseURL = `${req.protocol}://${req.get("host")}`;

        let query = { _id: id };

        if (req.user.role === "admin") {
            query.university = req.user.university;
        }

        const reward = await VendorReward.findOne(query);

        if (!reward) {
            return res.status(404).json({
                success: false,
                message: "Reward not found"
            });
        }

        const rewardResponse = reward.toObject();

        if (rewardResponse.rewardImage) {
            rewardResponse.rewardImage = `${baseURL}${rewardResponse.rewardImage}`;
        }

        return res.status(200).json({
            success: true,
            data: rewardResponse
        });

    } catch (error) {
        console.error("Get single reward error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};



export const updateVendorReward = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body || {};

        let query = { _id: id };

        if (req.user.role === "admin") {
            query.university = req.user.university;
        }

        const reward = await VendorReward.findOne(query);

        if (!reward) {
            return res.status(404).json({
                success: false,
                message: "Reward not found"
            });
        }

        if (updates.name) reward.name = updates.name;
        if (updates.description) reward.description = updates.description;

        if (req.file) {
            reward.rewardImage = `/uploads/profile-images/${req.file.filename}`;
        }

        await reward.save();

        return res.status(200).json({
            success: true,
            message: "Reward updated successfully",
            data: reward
        });

    } catch (error) {
        console.error("Update reward error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


export const deleteVendorReward = async (req, res) => {
    try {
        const { id } = req.params;

        let query = { _id: id };

        if (req.user.role === "admin") {
            query.university = req.user.university;
        }

        const reward = await VendorReward.findOneAndDelete(query);

        if (!reward) {
            return res.status(404).json({
                success: false,
                message: "Reward not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Reward deleted successfully"
        });

    } catch (error) {
        console.error("Delete reward error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

