import VendorReward from "../models/vendorReward.model.js";

export const createVendorReward = async (req, res) => {
    try {
        const vendorId = req.user.id;

        const { name, description, stockStatus } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Reward name is required"
            });
        }

        const rewardImage = req.file
            ? `/uploads/profile-images/${req.file.filename}`
            : null;

        const vendor = req.user;

        const reward = await VendorReward.create({
            name,
            description,
            stockStatus: stockStatus || "in_stock",
            rewardImage,
            vendor: vendorId,
            university: vendor.university,
            createdBy: vendorId
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


export const getMyVendorRewards = async (req, res) => {
    try {
        const vendorId = req.user.id;
        const baseURL = `${req.protocol}://${req.get("host")}`;

        let { page = 1, limit = 10 } = req.query;

        page = Math.max(1, parseInt(page));
        limit = Math.min(50, Math.max(1, parseInt(limit)));

        const skip = (page - 1) * limit;

        const query = {
            vendor: vendorId,
            isActive: true
        };

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
        console.error("Get vendor rewards error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const getSingleVendorReward = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { id } = req.params;

    const baseURL = `${req.protocol}://${req.get("host")}`;

    const reward = await VendorReward.findOne({
      _id: id,
      vendor: vendorId
    });

    if (!reward) {
      return res.status(404).json({
        success: false,
        message: "Reward not found"
      });
    }

    const rewardResponse = reward.toObject();

    // Attach full image URL
    if (rewardResponse.rewardImage) {
      rewardResponse.rewardImage = `${baseURL}${rewardResponse.rewardImage}`;
    }

    return res.status(200).json({
      success: true,
      data: rewardResponse
    });

  } catch (error) {
    console.error("Get single vendor reward error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


export const updateVendorReward = async (req, res) => {
    try {
        const vendorId = req.user.id;
        const { id } = req.params;
        const updates = req.body || {};

        const reward = await VendorReward.findOne({
            _id: id,
            vendor: vendorId
        });

        if (!reward) {
            return res.status(404).json({
                success: false,
                message: "Reward not found"
            });
        }

        if (updates.name) reward.name = updates.name;
        if (updates.description) reward.description = updates.description;
        if (updates.stockStatus) reward.stockStatus = updates.stockStatus;

        if (req.file) {
            reward.rewardImage = `/uploads/profile-images/${req.file.filename}`;
        }

        await reward.save();

        res.status(200).json({
            success: true,
            message: "Reward updated successfully",
            data: reward
        });

    } catch (error) {
        console.error("Update vendor reward error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


export const deleteVendorReward = async (req, res) => {
    try {
        const vendorId = req.user.id;
        const { id } = req.params;

        const reward = await VendorReward.findOneAndDelete({
            _id: id,
            vendor: vendorId
        });

        if (!reward) {
            return res.status(404).json({
                success: false,
                message: "Reward not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Reward deleted successfully"
        });

    } catch (error) {
        console.error("Delete vendor reward error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

