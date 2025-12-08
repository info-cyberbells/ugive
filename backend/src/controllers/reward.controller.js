
import jwt from "jsonwebtoken";
import { Reward } from "../models/reward.model.js";
import User from "../models/user.model.js";
import { StudentRewardProgress } from "../models/studentRewardProgress.model.js";


// Create Reward
export const createReward = async (req, res) => {
    try {
        const { name, university, college, rewardDescription, totalPoints } = req.body;

        if (!name || !university || !rewardDescription || !totalPoints) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const rewardImage = req.file ? "/" + req.file.path.replace(/\\/g, "/") : null;

        const reward = await Reward.create({
            name,
            university,
            college,
            rewardDescription,
            totalPoints,
            rewardImage,
            createdBy: req.user?._id,
        });

        return res.status(201).json({
            message: "Reward created successfully",
            reward,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get All Rewards
export const getRewards = async (req, res) => {
    try {
        let { page, limit } = req.query;

        page = Number(page) > 0 ? Number(page) : 1;
        limit = Number(limit) > 0 ? Number(limit) : 10;

        const totalRewards = await Reward.countDocuments();

        const rewards = await Reward.find()
            .populate("university", "name")
            .populate("college", "name")
            .populate("createdBy", "fullName email")
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        const baseURL = `${req.protocol}://${req.get("host")}`;

        const formattedRewards = rewards.map((reward) => {

            let imageUrl = null;

            if (reward.rewardImage) {
                const cleanPath = reward.rewardImage.replace(/\\/g, "/");

                const finalPath = cleanPath.startsWith("/")
                    ? cleanPath
                    : `/${cleanPath}`;

                imageUrl = baseURL + finalPath;
            }

            return {
                _id: reward._id,
                name: reward.name,
                university: reward.university,
                college: reward.college,
                rewardDescription: reward.rewardDescription,
                rewardImage: imageUrl,
                totalPoints: reward.totalPoints,
                createdBy: reward.createdBy,
                createdAt: reward.createdAt,
                updatedAt: reward.updatedAt
            };
        });

        res.json({
            success: true,
            page,
            limit,
            totalRewards,
            totalPages: Math.ceil(totalRewards / limit),
            rewards: formattedRewards
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};


export const getSingleReward = async (req, res) => {
    try {
        const rewardId = req.params.id;

        const reward = await Reward.findById(rewardId)
            .populate("university", "name")
            .populate("college", "name")
            .populate("createdBy", "fullName email");

        if (!reward) {
            return res.status(404).json({
                success: false,
                message: "Reward not found"
            });
        }

        const baseURL = `${req.protocol}://${req.get("host")}`;

        let imageUrl = null;
        if (reward.rewardImage) {
            const cleanPath = reward.rewardImage.replace(/\\/g, "/");
            const finalPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
            imageUrl = baseURL + finalPath;
        }

        res.json({
            success: true,
            reward: {
                _id: reward._id,
                name: reward.name,
                rewardDescription: reward.rewardDescription,
                rewardImage: imageUrl,
                university: reward.university,
                college: reward.college,
                totalPoints: reward.totalPoints,
                createdBy: reward.createdBy,
                createdAt: reward.createdAt,
                updatedAt: reward.updatedAt
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};



// Update Reward
export const updateReward = async (req, res) => {
    try {
        const rewardId = req.params.id;

        let existingReward = await Reward.findById(rewardId);
        if (!existingReward) {
            return res.status(404).json({ message: "Reward not found" });
        }

        const { name, university, college, rewardDescription, totalPoints } = req.body;

        let updatedData = {
            name,
            university,
            college,
            rewardDescription,
            totalPoints,
        };

        // If new image uploaded, fix path before saving
        if (req.file) {
            const cleanPath = req.file.path.replace(/\\/g, "/");
            updatedData.rewardImage = cleanPath.startsWith("/")
                ? cleanPath
                : `/${cleanPath}`;
        }

        // Update reward
        let updatedReward = await Reward.findByIdAndUpdate(
            rewardId,
            updatedData,
            { new: true }
        )
            .populate("university", "name")
            .populate("college", "name")
            .populate("createdBy", "fullName email");

        // Build full image URL
        const baseURL = `${req.protocol}://${req.get("host")}`;
        let imageUrl = null;

        if (updatedReward.rewardImage) {
            const finalPath = updatedReward.rewardImage.replace(/\\/g, "/");
            imageUrl = finalPath.startsWith("/")
                ? baseURL + finalPath
                : baseURL + "/" + finalPath;
        }

        // Clean Response
        res.json({
            success: true,
            message: "Reward updated successfully",
            reward: {
                _id: updatedReward._id,
                name: updatedReward.name,
                rewardDescription: updatedReward.rewardDescription,
                rewardImage: imageUrl,
                university: updatedReward.university,
                college: updatedReward.college,
                totalPoints: updatedReward.totalPoints,
                createdBy: updatedReward.createdBy,
                createdAt: updatedReward.createdAt,
                updatedAt: updatedReward.updatedAt,
            },
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};



// Delete Reward
export const deleteReward = async (req, res) => {
    try {
        const deleted = await Reward.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "Reward not found" });
        }

        res.json({ message: "Reward deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};



//get all rewards to the students for their college only
export const getStudentRewards = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        const studentId = decoded.id;

        const student = await User.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const { university } = student;

        const rewards = await Reward.find({ university }).sort({ createdAt: -1 });

        const baseURL = `${req.protocol}://${req.get("host")}`;

        let result = [];

        for (let reward of rewards) {
            const progress = await StudentRewardProgress.findOne({
                student: studentId,
                reward: reward._id,
            });

            const completed = progress ? progress.completedPoints : 0;

            const percentage = Math.round((completed / reward.totalPoints) * 100);

            result.push({
                rewardId: reward._id,
                rewardName: reward.name,
                rewardDescription: reward.rewardDescription,

                totalPoints: reward.totalPoints,
                completedPoints: completed,
                percentage,

                unlocked: completed >= reward.totalPoints,
                claimed: progress ? progress.claimed : false,
                rewardImage: reward.rewardImage
                    ? `${baseURL}${reward.rewardImage}`
                    : null,

                createdAt: reward.createdAt,
                updatedAt: reward.updatedAt,
            });
        }

        res.status(200).json({
            success: true,
            message: "Rewards fetched successfully",
            data: result,
        });
    } catch (error) {
        console.error("Error fetching student rewards:", error);
        res.status(500).json({ message: "Server error" });
    }
};


export const claimReward = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { rewardId } = req.body;

        const reward = await Reward.findById(rewardId);
        if (!reward) {
            return res.status(404).json({
                success: false,
                message: "Reward not found",
            });
        }

        const progress = await StudentRewardProgress.findOne({
            student: studentId,
            reward: rewardId,
        });

        if (!progress) {
            return res.status(400).json({
                success: false,
                message: "You haven't started progress on this reward",
            });
        }

        if (progress.completedPoints < reward.totalPoints) {
            return res.status(400).json({
                success: false,
                message: "Reward is not unlocked yet. Complete more cards to unlock it.",
            });
        }

        if (progress.claimed) {
            return res.status(400).json({
                success: false,
                message: "You have already claimed this reward",
            });
        }

        progress.claimed = true;
        progress.claimedAt = new Date();
        await progress.save();

        return res.status(200).json({
            success: true,
            message: "Reward claimed successfully!",
            reward: {
                rewardId: reward._id,
                rewardName: reward.name,
                claimed: true,
                claimedAt: progress.claimedAt,
            },
        });
    } catch (error) {
        console.error("Error claiming reward:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
