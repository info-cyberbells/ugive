import Card from "../models/card.model.js";
import User from "../models/user.model.js";
import { Reward } from "../models/reward.model.js";
import { StudentRewardProgress } from "../models/studentRewardProgress.model.js";

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
      recipient_email,
      reward,
      receiver,
      college,
      university,
      message
    } = req.body;
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
    weekStart.setDate(now.getDate() - now.getDay());
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

    const rewardData = await Reward.findById(reward);
    if (!rewardData) {
      return res.status(404).json({
        success: false,
        message: "Reward not found."
      });
    }

    if (rewardData.university.toString() !== university) {
      return res.status(400).json({
        success: false,
        message: "This reward does not belong to the selected university."
      });
    }


    const card = await Card.create({
      sender: studentId,
      recipient_name,
      recipient_email,
      college: college || null,
      reward,
      receiver: receiver || null,
      university,
      message
    });

    let progress = await StudentRewardProgress.findOne({
      student: studentId,
      reward: reward
    });

    if (!progress) {
      progress = await StudentRewardProgress.create({
        student: studentId,
        reward: reward,
        completedPoints: 1
      });
    } else {
      progress.completedPoints += 1;
      if (progress.completedPoints > rewardData.totalPoints) {
        progress.completedPoints = rewardData.totalPoints;
      }
      await progress.save();
    }


    const populatedCard = await Card.findById(card._id)
      .populate("university", "name")
      .populate("reward", "name totalPoints completedPoints")
      .populate({
        path: "college",
        select: "name",
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
    const cards = await Card.find({ college: collegeId }).populate("sender", "name email");
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

    // Get all rewards for the student's university
    const rewards = await Reward.find({ university: universityId })
      .sort({ totalPoints: 1 });

    if (!rewards.length) {
      return res.status(200).json({
        success: true,
        message: "No rewards found",
        data: null
      });
    }

    let finalData = [];

    for (let R of rewards) {
      let progress = await StudentRewardProgress.findOne({
        student: studentId,
        reward: R._id
      });

      const completed = progress ? progress.completedPoints : 0;

      finalData.push({
        rewardId: R._id,
        rewardName: R.name,
        rewardDescription: R.rewardDescription,
        totalPoints: R.totalPoints,
        completedPoints: completed,
        percentage: Math.round((completed / R.totalPoints) * 100),
        unlocked: completed >= R.totalPoints
      });
    }

    return res.status(200).json({
      success: true,
      rewards: finalData
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
      .populate("university", "name")
      .populate("reward", "name")
      .populate("college", "name")
      .sort({ createdAt: -1 });

    const formatted = cards.map(card => ({
      ...card.toObject(),

      university: card.university ? card.university.name : null,
      college: card.college ? card.college.name : null,
      reward: card.reward ? card.reward.name : null,

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