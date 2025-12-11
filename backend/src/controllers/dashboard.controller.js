import User from "../models/user.model.js";
import University from "../models/university.model.js";
import College from "../models/college.model.js";
import Card from "../models/card.model.js";
import { Reward } from "../models/reward.model.js";
import { MonthlyStreak } from "../models/monthlyStreak.model.js";
import FriendRequest from "../models/friendRequest.model.js";
import NotificationActivity from "../models/notificationActivity.model.js";

export const getSuperAdminDashboard = async (req, res) => {
    try {
        if (req.user.role !== "super_admin") {
            return res.status(403).json({ message: "Access denied. Super admin only." });
        }

        // Date calculations
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // ✅ OPTIMIZED: Reduced from 17 to 14 queries
        const [
            totalStudents,
            totalAdmins,
            totalUniversities,
            totalColleges,
            totalRewards,
            newUsersLast30Days,
            totalStreakRecords,
            cardsToday,
            cardsLast7Days,
            cardsLast30Days,
            universitiesWithStudents,
            topCardSenders,
            recentCards,
            recentUsers
        ] = await Promise.all([
            // Basic counts
            User.countDocuments({ role: "student", isDeleted: false }),
            User.countDocuments({ role: "admin", isDeleted: false }),
            University.countDocuments(),
            College.countDocuments(),
            Reward.countDocuments(),

            // User metrics
            User.countDocuments({ createdAt: { $gte: thirtyDaysAgo }, isDeleted: false }),
            MonthlyStreak.countDocuments(),

            // Card metrics
            Card.countDocuments({ sent_at: { $gte: today } }),
            Card.countDocuments({ sent_at: { $gte: sevenDaysAgo } }),
            Card.countDocuments({ sent_at: { $gte: thirtyDaysAgo } }),

            // Universities with most students (top 5)
            User.aggregate([
                { $match: { role: "student", isDeleted: false, university: { $ne: null } } },
                { $group: { _id: "$university", studentCount: { $sum: 1 } } },
                { $sort: { studentCount: -1 } },
                { $limit: 5 },
                {
                    $lookup: {
                        from: "universities",
                        localField: "_id",
                        foreignField: "_id",
                        as: "universityInfo"
                    }
                },
                { $unwind: "$universityInfo" },
                { $project: { universityName: "$universityInfo.name", studentCount: 1 } }
            ]),

            // Top card senders (top 5) - NAME ONLY
            Card.aggregate([
                { $group: { _id: "$sender", cardsSent: { $sum: 1 } } },
                { $sort: { cardsSent: -1 } },
                { $limit: 5 },
                {
                    $lookup: {
                        from: "users",
                        localField: "_id",
                        foreignField: "_id",
                        as: "senderInfo"
                    }
                },
                { $unwind: "$senderInfo" },
                { $project: { name: "$senderInfo.name", cardsSent: 1 } }
            ]),

            // Recent 3 cards - NAME ONLY
            Card.find()
                .sort({ sent_at: -1 })
                .limit(3)
                .populate("sender", "name")
                .select("sender recipient_name message sent_at")
                .lean(),

            // Recent 3 users
            User.find({ isDeleted: false })
                .sort({ createdAt: -1 })
                .limit(3)
                .select("name email role createdAt")
                .populate("university", "name")
                .populate("college", "name")
                .lean()
        ]);

        // Simple calculation without extra queries
        const avgCardsPerStudent = totalStudents > 0
            ? (cardsLast30Days / totalStudents).toFixed(2)
            : 0;

        const dashboardData = {
            overview: {
                totalStudents,
                totalAdmins,
                totalUniversities,
                totalColleges,
                totalRewards
            },
            userMetrics: {
                newUsersLast30Days,
                userGrowthRate: 0,
                totalStreakRecords
            },
            cardMetrics: {
                cardsToday,
                cardsLast7Days,
                cardsLast30Days,
                cardGrowthRate: 0,
                avgCardsPerStudent: parseFloat(avgCardsPerStudent)
            },
            topPerformers: {
                universitiesWithMostStudents: universitiesWithStudents,
                topCardSenders
            },
            recentActivity: {
                recentCards,
                recentUsers
            }
        };

        res.status(200).json({
            message: "Super admin dashboard data retrieved successfully",
            data: dashboardData
        });

    } catch (error) {
        console.error("Error fetching super admin dashboard:", error);
        res.status(500).json({
            message: "Failed to fetch dashboard data",
            error: error.message
        });
    }
};





export const getStudentDashboard = async (req, res) => {
    try {
        // Verify student role
        if (req.user.role !== "student") {
            return res.status(403).json({ message: "Access denied. Students only." });
        }

        const studentId = req.user._id;

        // Current month info
        const now = new Date();
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        // Run all queries in parallel
        const [
            studentInfo,
            totalCardsSent,
            totalGiftsSent,
            currentMonthCardsSent,
            currentMonthStreak,
            totalFriends,
            pendingRequestsReceived,
            recentCardsSent,
            recentCardsReceived
        ] = await Promise.all([
            // 1. Student basic info
            User.findById(studentId)
                .select("name email")
                .populate("university", "name")
                .populate("college", "name")
                .lean(),

            // 2. Cards sent by student
            Card.countDocuments({ sender: studentId }),


            // 3. Total gifts (rewards) sent by student
            Card.countDocuments({
                sender: studentId,
                reward: { $ne: null }
            }),

            // Cards sent in the current month
            Card.countDocuments({
                sender: studentId,
                createdAt: {
                    $gte: new Date(now.getFullYear(), now.getMonth(), 1),
                    $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1)
                }
            }),



            // 4. Current month streak data
            MonthlyStreak.findOne({
                student: studentId,
                monthKey: monthKey
            })
                .select("currentStreak bestStreak totalCardsThisMonth monthLabel")
                .lean(),

            // 5. Total accepted friends
            FriendRequest.countDocuments({
                $or: [
                    { sender: studentId, status: "accepted" },
                    { receiver: studentId, status: "accepted" }
                ]
            }),

            // 6. Pending friend requests received
            FriendRequest.countDocuments({
                receiver: studentId,
                status: "pending"
            }),

            // 7. Recent cards sent (last 3)
            Card.find({ sender: studentId })
                .sort({ sent_at: -1 })
                .limit(3)
                .select("recipient_name message sent_at")
                .lean(),

            // 8. Recent cards received (last 3)
            Card.find({ receiver_id: studentId })
                .sort({ sent_at: -1 })
                .limit(3)
                .select("sender message sent_at")
                .populate("sender", "name email")
                .lean()
        ]);

        // Compile dashboard data
        const dashboardData = {
            studentProfile: {
                name: studentInfo.name,
                email: studentInfo.email,
                university: studentInfo.university?.name || null,
                college: studentInfo.college?.name || null
            },
            cardStats: {
                totalCardsSent,
                totalGiftsSent
            },
            streakInfo: {
                currentStreak: currentMonthStreak?.currentStreak || 0,
                bestStreak: currentMonthStreak?.bestStreak || 0,
                totalCardsThisMonth: currentMonthCardsSent,
                monthLabel: currentMonthStreak?.monthLabel || `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`
            },
            friendStats: {
                totalFriends,
                pendingRequestsReceived
            },
            recentActivity: {
                recentCardsSent,
                recentCardsReceived
            }
        };

        res.status(200).json({
            message: "Student dashboard data retrieved successfully",
            data: dashboardData
        });

    } catch (error) {
        console.error("Error fetching student dashboard:", error);
        res.status(500).json({
            message: "Failed to fetch dashboard data",
            error: error.message
        });
    }
};



export const getSuperAdminEvents = async (req, res) => {
    try {
        const events = await NotificationActivity.find().sort({ createdAt: -1 }).limit(20);

        return res.status(200).json({
            success: true,
            notifications: events.filter(e => e.type === "notification"),
            activities: events.filter(e => e.type === "activity")
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const getStudentNotifications = async (req, res) => {
    try {
        const userId = req.user.id;

        const notifications = await NotificationActivity.find({
            $or: [
                { createdBy: userId },
                { "meta.userId": userId },
            ]
        })
            .sort({ createdAt: -1 })
            .limit(10);

        return res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications
        });

    } catch (error) {
        console.error("Notification error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};