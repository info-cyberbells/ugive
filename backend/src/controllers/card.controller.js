import Card from "../models/card.model.js";
import User from "../models/user.model.js";
import { Reward } from "../models/reward.model.js";
import { StudentRewardProgress } from "../models/studentRewardProgress.model.js";
import NotificationActivity from "../models/notificationActivity.model.js";

export const getCurrentWeekRange = () => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday

  // Week starts Monday
  const diff = day === 0 ? 6 : day - 1;

  const weekStart = new Date(now);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(now.getDate() - diff);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  return { weekStart, weekEnd };
};

function formatDateToMonthDay(date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric"
  });
}

// Create a new Card
export const createCard = async (req, res) => {
  try {
    const studentId = req.user.id;
    const {
      recipient_name,
      recipient_last_name,
      sender_name,
      recipient_email,
      college_name,
      reward,
      message
    } = req.body;

    if (reward) {
      const rewardExists = await Reward.findById(reward);
      if (!rewardExists) {
        return res.status(400).json({
          success: false,
          message: "Invalid reward ID. This reward does not exist."
        });
      }
    }

    const allowedDomain = process.env.STUDENT_EMAIL_DOMAIN || "@usq.edu.au";
    const emailExists = await User.findOne({ email: recipient_email });
    if (!emailExists) {
      // If email not found → must be university domain
      if (!recipient_email.toLowerCase().endsWith(allowedDomain.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: `This email is not registered. Only university emails (${allowedDomain}) are allowed.`
        });
      }
    }

    const sender = await User.findById(studentId);
    if (sender.email === recipient_email) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a card to yourself."
      });
    }

    const now = new Date();
    const weekStart = new Date(now);
    const day = now.getDay();
    const diff = day === 0 ? 6 : day - 1;
    weekStart.setDate(now.getDate() - diff);
    weekStart.setHours(0, 0, 0, 0);

    const sentThisWeek = await Card.countDocuments({
      sender: studentId,
      createdAt: { $gte: weekStart }
    });

    const nextDate = new Date(weekStart);
    nextDate.setDate(nextDate.getDate() + 7);

    if (sentThisWeek >= 2) {
      return res.status(429).json({
        success: false,
        message: `You're on a break! You can send your next card on ${formatDateToMonthDay(nextDate)}.`,
        next_available_date: formatDateToMonthDay(nextDate)
      });
    }



    const receiverUser = await User.findOne({ email: recipient_email });
    const receiver_id = receiverUser ? receiverUser._id : null;

    const card = await Card.create({
      sender: studentId,
      receiver_id,
      sender_name: sender_name || null,
      recipient_name,
      recipient_last_name: recipient_last_name || null,
      recipient_email,
      college_name: college_name || null,
      reward: reward || null,
      message
    });

    const universityRewards = await Reward.find({
      university: sender.university
    });

    for (const rewardItem of universityRewards) {
      let progress = await StudentRewardProgress.findOne({
        student: studentId,
        reward: rewardItem._id
      });

      if (!progress) {
        await StudentRewardProgress.create({
          student: studentId,
          reward: rewardItem._id,
          completedPoints: 1,
          claimed: false
        });
      }
      else if (progress.completedPoints < rewardItem.totalPoints) {
        progress.completedPoints += 1;
        await progress.save();
      }
      // If completed → do nothing
    }



    const populatedCard = await Card.findById(card._id)
      .populate("reward", "name")
      .lean();

    await NotificationActivity.create({
      type: "notification",
      action: "card_sent",
      message: `${sender.name} sent a card to ${recipient_name}`,
      createdBy: studentId,
      meta: { cardId: card._id }
    });

    return res.status(201).json({
      success: true,
      message: "Card sent successfully!",
      note: `Note: Cards are delivered each ${formatDateToMonthDay(nextDate)} with an evening cutoff on ${formatDateToMonthDay(nextDate)} to allow time for printing.`,
      card: populatedCard,
    });

  } catch (error) {
    console.error("Send card error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// export const createCardOLDNOTINUSE = async (req, res) => {
//   try {
//     const { college, message, recipient_name, type } = req.body;

//     // Use logged-in user as sender
//     const sender = req.user._id;
//     const card = await Card.create({ sender, college, message, recipient_name, type });
//     res.status(201).json({ success: true, card });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// Get all Cards for a College


export const getCardsByCollege = async (req, res) => {
  try {
    const { collegeId } = req.params;
    const cards = await Card.find({ college_name: collegeId }).populate("sender", "name email");
    res.status(200).json({ success: true, cards });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const getCardProgress = async (req, res) => {
  try {
    const studentId = req.user.id;
    const universityId = req.user.university;

    const rewards = await Reward.find({ university: universityId })
      .sort({ totalPoints: 1 });

    if (!rewards.length) {
      return res.status(200).json({
        success: true,
        message: "No rewards found",
        currentReward: null,
        nextRewards: []
      });
    }

    let progressList = [];

    for (let R of rewards) {
      const progress = await StudentRewardProgress.findOne({
        student: studentId,
        reward: R._id
      });

      const completed = progress ? progress.completedPoints : 0;

      progressList.push({
        rewardId: R._id.toString(),
        rewardName: R.name,
        rewardDescription: R.rewardDescription,
        totalPoints: R.totalPoints,
        completedPoints: completed,
        percentage: Math.round((completed / R.totalPoints) * 100),
        unlocked: completed >= R.totalPoints
      });
    }


    let inProgress = progressList
      .filter(r => r.completedPoints > 0 && r.completedPoints < r.totalPoints)
      .sort((a, b) => b.completedPoints - a.completedPoints);

    let currentReward = null;

    if (inProgress.length > 0) {
      currentReward = inProgress[0];
    } else {
      currentReward = progressList[0];
    }

    const currentIndex = progressList.findIndex(
      r => r.rewardId === currentReward.rewardId
    );

    const nextRewards = progressList.filter(
      r => r.rewardId !== currentReward.rewardId
    );

    return res.status(200).json({
      success: true,
      currentReward,
      nextRewards
    });

  } catch (error) {
    console.error("Error fetching reward progress:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



export const checkCardEligibility = async (req, res) => {
  try {
    const authUser = req.user;

    if (authUser.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can check card eligibility.",
      });
    }

    const studentId = authUser.id;
    const { weekStart, weekEnd } = getCurrentWeekRange();

    // Count cards sent in the current week
    const sentThisWeek = await Card.countDocuments({
      sender: studentId,
      createdAt: { $gte: weekStart, $lt: weekEnd }
    });

    // Not eligible
    if (sentThisWeek >= 2) {
      const nextDate = new Date(weekEnd);
      nextDate.setHours(0, 0, 0, 0);

      return res.status(429).json({
        success: false,
        eligible: false,
        message: `You're on a break! Thanks for sending your last card. You can send another card from ${formatDateToMonthDay(nextDate)}.`,
        next_available_date: formatDateToMonthDay(nextDate),
      });
    }

    // Eligible
    return res.status(200).json({
      success: true,
      eligible: true,
      message: "You can send a card now."
    });

  } catch (error) {
    console.error("Eligibility check error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSentCards = async (req, res) => {
  try {
    const studentId = req.user.id;

    const cards = await Card.find({ sender: studentId })
      .populate("reward", "name")
      .sort({ createdAt: -1 });

    const formatted = cards.map(card => ({
      ...card.toObject(),
      reward: card.reward ? card.reward.name : null,
      college_name: card.college_name || null,


      date: formatDate(card.createdAt)
    }));

    return res.status(200).json({
      success: true,
      count: formatted.length,
      cards: formatted
    });

  } catch (error) {
    console.error("Error fetching card list:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}






export const getUniversityCardsForAdmin = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    const adminUniversityId = req.user.university;

    // ✅ Pagination from frontend
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    // 1️⃣ Get student IDs of admin university
    const studentIds = await User.find({
      role: "student",
      university: adminUniversityId
    }).distinct("_id");

    // 2️⃣ Total count
    const total = await Card.countDocuments({
      sender: { $in: studentIds }
    });

    // 3️⃣ Paginated cards
    const cards = await Card.find({
      sender: { $in: studentIds }
    })
      .populate("sender", "name email university")
      .populate("receiver_id", "name email role university college")
      .populate("reward", "name points")
      .sort({ sent_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      count: cards.length, // 🔥 items in this page
      data: cards
    });

  } catch (error) {
    console.error("Get university cards error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const updateCardStatus = async (req, res) => {
  try {
    if (!["admin", "vendor"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    const { cardId } = req.params;
    const { status } = req.body;

    const allowedStatus = ["pending", "printed", "delivered"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found"
      });
    }

    if (req.user.role === "admin" && card.reward && status === "printed") {

      const reward = await Reward.findById(card.reward);

      await NotificationActivity.create({
        type: "notification",
        action: "card_printed",
        message: "A reward card is ready for delivery",
        createdBy: req.user.id,
        meta: {
          vendorId: reward.vendor,
          cardId: card._id,
          status: "printed"
        }
      });
    }

    card.status = status;
    await card.save();

    return res.status(200).json({
      success: true,
      message: "Card status updated successfully",
      data: card
    });

  } catch (error) {
    console.error("Update card status error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const deleteCardByAdmin = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    const { cardId } = req.params;

    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found"
      });
    }

    await Card.findByIdAndDelete(cardId);

    return res.status(200).json({
      success: true,
      message: "Card deleted successfully"
    });

  } catch (error) {
    console.error("Delete card error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


export const getPrintedRewardCardsForVendor = async (req, res) => {
  try {
    if (req.user.role !== "vendor") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Vendor only."
      });
    }

    const cards = await Card.find({
      status: "printed",
      reward: { $ne: null }
    })
      .populate("reward", "name")
      .populate("sender", "name email")
      .sort({ updatedAt: -1 })
      .select(
        "sender_name recipient_name recipient_last_name recipient_email college_name message reward status sent_at"
      )
      .lean();

    return res.status(200).json({
      success: true,
      count: cards.length,
      data: cards
    });

  } catch (error) {
    console.error("Get printed reward cards error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

