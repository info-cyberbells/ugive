
import jwt from "jsonwebtoken";
import { Reward } from "../models/reward.model.js";
import User from "../models/user.model.js";
import { StudentRewardProgress } from "../models/studentRewardProgress.model.js";
import NotificationActivity from "../models/notificationActivity.model.js";
import Card from "../models/card.model.js";
import FriendRequest from "../models/friendRequest.model.js";
import { MonthlyStreak } from "../models/monthlyStreak.model.js";
import VendorReward from "../models/vendorReward.model.js";



// Create Reward
export const createReward = async (req, res) => {
    try {
        const { name, university, college, rewardDescription, totalPoints, rewardImagePath } = req.body;

        if (!name || !university || !rewardDescription || !totalPoints) {
            return res.status(400).json({ message: "All fields are required." });
        }

        let rewardImage = null;

        if (req.file) {
            rewardImage = "/" + req.file.path.replace(/\\/g, "/");
        } else if (rewardImagePath) {
            try {
                const url = new URL(rewardImagePath);
                rewardImage = url.pathname;
            } catch (error) {
                rewardImage = rewardImagePath;
            }
        }

        const reward = await Reward.create({
            name,
            university,
            college,
            rewardDescription,
            totalPoints,
            rewardImage,
            createdBy: req.user?._id,
        });
        await NotificationActivity.create({
            type: "activity",
            action: "reward_created",
            message: `New reward created: ${name}`,
            createdBy: req.user?._id
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
        } else if (req.body.rewardImagePath) {
            try {
                const url = new URL(req.body.rewardImagePath);
                updatedData.rewardImage = url.pathname;
            } catch (error) {
                updatedData.rewardImage = req.body.rewardImagePath;
            }
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
        await NotificationActivity.create({
            type: "activity",
            action: "reward_updated",
            message: `Reward updated: ${name}`,
            createdBy: req.user.id
        });

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

        const now = new Date();
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        // Run stats queries in parallel
        const [
            totalCardsSent,
            totalGiftsSent,
            incomingFriendRequests,
            currentMonthStreak
        ] = await Promise.all([

            Card.countDocuments({ sender: studentId }),

            Card.countDocuments({
                sender: studentId,
                reward: { $ne: null }
            }),

            FriendRequest.countDocuments({
                receiver: studentId,
                status: "pending"
            }),

            MonthlyStreak.findOne({ student: studentId, monthKey })
                .select("currentStreak")
                .lean()
        ]);


        const rewards = await Reward.find({
            university,
            $or: [
                { college: { $exists: false } },
                { college: null },
                { college: student.college }
            ]
        }).sort({ createdAt: -1 });

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
            stats: {
                totalCardsSent,
                totalGiftsSent,
                incomingFriendRequests,
                currentStreak: currentMonthStreak?.currentStreak || 0
            },
            data: result,
        });
    } catch (error) {
        console.error("Error fetching student rewards:", error);
        res.status(500).json({ message: "Server error" });
    }
};

//claim reward
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


//admin reward create
export const createRewardByUniversityAdmin = async (req, res) => {
    try {
        const admin = req.user;

        if (!admin.university) {
            return res.status(400).json({
                success: false,
                message: "Admin is not linked to any university"
            });
        }

        const {
            name,
            college,
            rewardDescription,
            totalPoints
        } = req.body;

        if (!name || !rewardDescription || !totalPoints) {
            return res.status(400).json({
                message: "All required fields must be provided"
            });
        }

        let rewardImage = null;

        if (req.file) {
            rewardImage = "/" + req.file.path.replace(/\\/g, "/");
        } else if (req.body.rewardImagePath) {
            try {
                const url = new URL(req.body.rewardImagePath);
                rewardImage = url.pathname;
            } catch (error) {
                rewardImage = req.body.rewardImagePath;
            }
        }
        const reward = await Reward.create({
            name,
            university: admin.university,
            college: college || null,
            rewardDescription,
            totalPoints,
            rewardImage,
            createdBy: admin._id
        });

        await NotificationActivity.create({
            type: "activity",
            action: "reward_created",
            message: `University admin created reward: ${name}`,
            createdBy: admin._id
        });

        return res.status(201).json({
            success: true,
            message: "Reward created successfully",
            reward
        });

    } catch (error) {
        console.error("Create reward by admin error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

//get all rewards
export const getRewardsByUniversityAdmin = async (req, res) => {
    try {
        const admin = req.user;
        const baseURL = `${req.protocol}://${req.get("host")}`;

        let { page = 1, limit = 10 } = req.query;
        page = Math.max(1, parseInt(page));
        limit = Math.min(50, parseInt(limit));

        const query = { university: admin.university };

        const totalRewards = await Reward.countDocuments(query);

        const rewards = await Reward.find(query)
            .populate("university", "name")
            .populate("college", "name")
            .populate("createdBy", "name email")
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        const formatted = rewards.map(r => ({
            ...r.toObject(),
            rewardImage: r.rewardImage ? `${baseURL}${r.rewardImage}` : null
        }));

        return res.status(200).json({
            success: true,
            page,
            limit,
            totalRewards,
            totalPages: Math.ceil(totalRewards / limit),
            rewards: formatted
        });

    } catch (error) {
        console.error("Get rewards by admin error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

//get single reward
export const getSingleRewardByUniversityAdmin = async (req, res) => {
    try {
        const admin = req.user;
        const { id } = req.params;

        const reward = await Reward.findOne({
            _id: id,
            university: admin.university
        })
            .populate("college", "name")
            .populate("createdBy", "name email");

        if (!reward) {
            return res.status(404).json({
                success: false,
                message: "Reward not found"
            });
        }

        const baseURL = `${req.protocol}://${req.get("host")}`;

        const response = reward.toObject();
        response.rewardImage = response.rewardImage
            ? `${baseURL}${response.rewardImage}`
            : null;

        return res.status(200).json({
            success: true,
            reward: response
        });

    } catch (error) {
        console.error("Get single reward admin error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

//update reward
export const updateRewardByUniversityAdmin = async (req, res) => {
    try {
        const admin = req.user;
        const { id } = req.params;

        const reward = await Reward.findOne({
            _id: id,
            university: admin.university
        });

        if (!reward) {
            return res.status(404).json({ message: "Reward not found" });
        }

        const {
            name,
            college,
            rewardDescription,
            totalPoints
        } = req.body;

        if (name) reward.name = name;
        if (college !== undefined) reward.college = college;
        if (rewardDescription) reward.rewardDescription = rewardDescription;
        if (totalPoints) reward.totalPoints = totalPoints;

        if (req.file) {
            const cleanPath = req.file.path.replace(/\\/g, "/");
            reward.rewardImage = cleanPath.startsWith("/")
                ? cleanPath
                : `/${cleanPath}`;
        } else if (req.body.rewardImagePath) {
            try {
                const url = new URL(req.body.rewardImagePath);
                reward.rewardImage = url.pathname;
            } catch (error) {
                reward.rewardImage = req.body.rewardImagePath;
            }
        }
        await reward.save();

        return res.json({
            success: true,
            message: "Reward updated successfully",
            reward
        });

    } catch (error) {
        console.error("Update reward admin error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

//delete reward
export const deleteRewardByUniversityAdmin = async (req, res) => {
    try {
        const admin = req.user;
        const { id } = req.params;

        const deleted = await Reward.findOneAndDelete({
            _id: id,
            university: admin.university
        });

        if (!deleted) {
            return res.status(404).json({ message: "Reward not found" });
        }

        return res.json({
            success: true,
            message: "Reward deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};


//get all vedors addeed reward
export const getAllVendorRewardsForSuperAdmin = async (req, res) => {
    try {
        const baseURL = `${req.protocol}://${req.get("host")}`;

        // Pagination
        let { page = 1, limit = 10 } = req.query;
        page = Math.max(1, parseInt(page));
        limit = Math.min(50, Math.max(1, parseInt(limit)));

        const skip = (page - 1) * limit;

        const total = await VendorReward.countDocuments();

        const rewards = await VendorReward.find()
            .populate("vendor", "name email")
            .populate("university", "name")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const formattedRewards = rewards.map(r => {
            const obj = r.toObject();
            return {
                ...obj,
                rewardImage: obj.rewardImage
                    ? `${baseURL}${obj.rewardImage}`
                    : null
            };
        });

        return res.status(200).json({
            success: true,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            data: formattedRewards
        });

    } catch (error) {
        console.error("Super admin get all vendor rewards error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

//add active rewrds from all rewrds
export const setVendorRewardActiveStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isActive must be true or false"
            });
        }

        const reward = await VendorReward.findById(id);

        if (!reward) {
            return res.status(404).json({
                success: false,
                message: "Reward not found"
            });
        }

        reward.isActive = isActive;
        await reward.save();

        return res.status(200).json({
            success: true,
            message: "Reward active status updated",
            data: {
                rewardId: reward._id,
                isActive: reward.isActive
            }
        });

    } catch (error) {
        console.error("Set reward active status error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

//show all active rewards 
export const getActiveVendorRewards = async (req, res) => {
    try {
        const baseURL = `${req.protocol}://${req.get("host")}`;

        const rewards = await VendorReward.find({
            isActive: true
        })
            .select("name description rewardImage")
            .sort({ createdAt: -1 });

        const formatted = rewards.map(r => ({
            _id: r._id,
            name: r.name,
            description: r.description,
            rewardImage: r.rewardImage
                ? `${baseURL}${r.rewardImage}`
                : null
        }));

        return res.status(200).json({
            success: true,
            data: formatted
        });

    } catch (error) {
        console.error("Get active rewards error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


export const getActiveVendorRewardsForAdmin = async (req, res) => {
    try {
        const baseURL = `${req.protocol}://${req.get("host")}`;
        const admin = req.user;

        // Safety check
        if (!admin || admin.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const rewards = await VendorReward.find({
            isActive: true,
            university: admin.university
        })
            .select("name description rewardImage")
            .sort({ createdAt: -1 });

        const formatted = rewards.map(r => ({
            _id: r._id,
            name: r.name,
            description: r.description,
            stockStatus: r.stockStatus,
            rewardImage: r.rewardImage
                ? `${baseURL}${r.rewardImage}`
                : null
        }));

        return res.status(200).json({
            success: true,
            data: formatted
        });

    } catch (error) {
        console.error("Get admin rewards error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
