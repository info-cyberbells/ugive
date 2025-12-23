import User from "../models/user.model.js";
import University from "../models/university.model.js";
import College from "../models/college.model.js";
import Card from "../models/card.model.js";
import { Reward } from "../models/reward.model.js";
import { MonthlyStreak } from "../models/monthlyStreak.model.js";
import FriendRequest from "../models/friendRequest.model.js";
import NotificationActivity from "../models/notificationActivity.model.js";
import VendorReward from "../models/vendorReward.model.js";

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
      totalVendors,
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
      User.countDocuments({ role: "student", isDeleted: { $ne: true } }),
      User.countDocuments({ role: "admin", isDeleted: { $ne: true } }),
      User.countDocuments({ role: "vendor", isDeleted: { $ne: true } }),
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
        { $match: { role: "student", isDeleted: { $ne: true }, university: { $ne: null } } },
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
      User.find({ isDeleted: false, role: "student" })
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
        totalVendors,
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


export const getAdminDashboard = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only."
      });
    }

    const universityId = req.user.university;

    // Dates
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 1️⃣ Get student IDs of this university
    const studentIds = await User.find({
      role: "student",
      university: universityId,
      isDeleted: { $ne: true }
    }).distinct("_id");

    // 2️⃣ Run queries in parallel
    const [
      totalStudents,
      totalColleges,
      totalCards,
      cardsToday,
      cardsLast7Days,
      cardsLast30Days,
      recentCards,
      recentStudents
    ] = await Promise.all([
      User.countDocuments({
        role: "student",
        university: universityId,
        isDeleted: { $ne: true }
      }),

      College.countDocuments({ university: universityId }),

      Card.countDocuments({ sender: { $in: studentIds } }),

      Card.countDocuments({
        sender: { $in: studentIds },
        sent_at: { $gte: today }
      }),

      Card.countDocuments({
        sender: { $in: studentIds },
        sent_at: { $gte: sevenDaysAgo }
      }),

      Card.countDocuments({
        sender: { $in: studentIds },
        sent_at: { $gte: thirtyDaysAgo }
      }),

      // Recent 5 cards
      Card.find({ sender: { $in: studentIds } })
        .sort({ sent_at: -1 })
        .limit(5)
        .populate("sender", "name email")
        .select("sender recipient_name message sent_at")
        .lean(),

      // Recent 5 students
      User.find({
        role: "student",
        university: universityId,
        isDeleted: { $ne: true }
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email createdAt")
        .lean()
    ]);

    return res.status(200).json({
      success: true,
      message: "Admin dashboard data fetched successfully",
      data: {
        overview: {
          totalStudents,
          totalColleges,
          totalCards
        },
        cardStats: {
          cardsToday,
          cardsLast7Days,
          cardsLast30Days
        },
        recentActivity: {
          recentCards,
          recentStudents
        }
      }
    });

  } catch (error) {
    console.error("Admin dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
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
      totalCardsReceived,
      totalCardsReceivedThisMonth,
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
        .lean(),

      // 2. Cards sent by student
      Card.countDocuments({ sender: studentId }),

      // Total cards received
      Card.countDocuments({
        receiver_id: studentId
      }),

      // Total cards received this month
      Card.countDocuments({
        receiver_id: studentId,
        createdAt: {
          $gte: new Date(now.getFullYear(), now.getMonth(), 1),
          $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1)
        }
      }),


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
      },
      cardStats: {
        totalCardsSent,
        totalGiftsSent,
        totalCardsReceived,
      },
      streakInfo: {
        currentStreak: currentMonthStreak?.currentStreak || 0,
        bestStreak: currentMonthStreak?.bestStreak || 0,
        totalCardsThisMonth: currentMonthCardsSent,
        totalCardsReceivedThisMonth,
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



export const getVendorDashboard = async (req, res) => {
  try {
    // 🔐 Role check
    if (req.user.role !== "vendor") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Vendor only."
      });
    }

    const vendorId = req.user.id;

    // 📅 Dates
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 1️⃣ Get rewards from BOTH collections
    const [vendorRewards, adminRewards] = await Promise.all([
      VendorReward.find({ vendor: vendorId }).select("_id"),
      Reward.find({ vendor: vendorId }).select("_id")
    ]);

    const rewardIds = [
      ...vendorRewards.map(r => r._id),
      ...adminRewards.map(r => r._id)
    ];

    // If no rewards, return empty dashboard (safe)
    if (rewardIds.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Vendor dashboard data fetched successfully",
        data: {
          overview: {
            totalRewards: 0,
            totalCards: 0,
            printedCards: 0,
            deliveredCards: 0
          },
          todayStats: {
            cardsPrintedToday: 0,
            cardsDeliveredToday: 0
          },
          recentActivity: {
            recentPrintedCards: [],
            recentDeliveredCards: []
          }
        }
      });
    }

    // 🔧 Query for cards belonging to this vendor's rewards (including null rewards)
    const cardQuery = {
      $or: [
        { reward: { $in: rewardIds } },  // Cards with valid vendor rewards
        { reward: null }                  // Cards with null reward
      ]
    };

    // 2️⃣ Parallel card queries
    const [
      totalCards,
      printedCards,
      deliveredCards,
      cardsPrintedToday,
      cardsDeliveredToday,
      recentPrintedCards,
      recentDeliveredCards
    ] = await Promise.all([

      // Total cards (printed + delivered)
      Card.countDocuments({
        ...cardQuery,
        status: { $in: ["printed", "delivered"] }
      }),

      // Printed cards
      Card.countDocuments({
        ...cardQuery,
        status: "printed"
      }),

      // Delivered cards
      Card.countDocuments({
        ...cardQuery,
        status: "delivered"
      }),

      // Printed today
      Card.countDocuments({
        ...cardQuery,
        status: "printed",
        updatedAt: { $gte: today }
      }),

      // Delivered today
      Card.countDocuments({
        ...cardQuery,
        status: "delivered",
        updatedAt: { $gte: today }
      }),

      // Recent printed cards
      Card.find({
        ...cardQuery,
        status: "printed"
      })
        .sort({ updatedAt: -1 })
        .limit(5)
        .select("recipient_name message updatedAt")
        .lean(),

      // Recent delivered cards
      Card.find({
        ...cardQuery,
        status: "delivered"
      })
        .sort({ updatedAt: -1 })
        .limit(5)
        .select("recipient_name message updatedAt")
        .lean()
    ]);

    // 3️⃣ Response
    return res.status(200).json({
      success: true,
      message: "Vendor dashboard data fetched successfully",
      data: {
        overview: {
          totalRewards: rewardIds.length,
          totalCards,
          printedCards,
          deliveredCards
        },
        todayStats: {
          cardsPrintedToday,
          cardsDeliveredToday
        },
        recentActivity: {
          recentPrintedCards,
          recentDeliveredCards
        }
      }
    });

  } catch (error) {
    console.error("Vendor dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
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


export const getAdminNotifications = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    const adminUniversityId = req.user.university;

    const universityUserIds = await User.find({
      university: adminUniversityId,
      isDeleted: { $ne: true }
    }).distinct("_id");

    const events = await NotificationActivity.find({
      $or: [
        { createdBy: { $in: universityUserIds } },
        { "meta.universityId": adminUniversityId }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return res.status(200).json({
      success: true,
      notifications: events.filter(e => e.type === "notification"),
      activities: events.filter(e => e.type === "activity"),
      total: events.length
    });

  } catch (error) {
    console.error("Admin notification error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


export const getVendorNotifications = async (req, res) => {
  try {
    if (req.user.role !== "vendor") {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    const vendorId = req.user.id;

    const events = await NotificationActivity.find({
      $or: [
        { createdBy: vendorId },
        { "meta.vendorId": vendorId }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return res.status(200).json({
      success: true,
      notifications: events.filter(e => e.type === "notification"),
      activities: events.filter(e => e.type === "activity"),
      total: events.length
    });

  } catch (error) {
    console.error("Vendor notification error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
