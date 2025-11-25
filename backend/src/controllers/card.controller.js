import Card from "../models/card.model.js";
import User from "../models/user.model.js";

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
    const { recipient_name, recipient_email, college, message, type } = req.body;
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

    if (sentThisWeek >= 1) {
      return res.status(429).json({
        success: false,
        message: `You're on a break! You can send your next card on ${formatDateToMonthDay(nextDate)}.`,
        next_available_date: formatDateToMonthDay(nextDate)
      });
    }

    const card = await Card.create({
      sender: studentId,
      recipient_name,
      recipient_email,
      college,
      message,
      type
    });


    const totalSent = await Card.countDocuments({ sender: studentId });
    const remaining = Math.max(5 - totalSent, 0);
    let percentage = totalSent * 20;
    if (percentage > 100) percentage = 100;
    const populatedCard = await Card.findById(card._id)
      .populate({
        path: "college",
        select: "name",
        populate: { path: "university", select: "name" }
      });

    return res.status(201).json({
      success: true,
      message: "Card sent successfully!",
      note: `Note: Cards are delivered each ${formatDateToMonthDay(nextDate)} with an evening cutoff on ${formatDateToMonthDay(nextDate)} to allow time for printing.`,
      card: populatedCard,
      cardsData: {
        totalSent,
        remaining,
        percentage,
        maxCards: 5,
      },
    });

  } catch (error) {
    console.error("Send card error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const createCardOLDNOTINUSE = async (req, res) => {
  try {
    const { college, message, recipient_name, type } = req.body;

    // Use logged-in user as sender
    const sender = req.user._id;
    const card = await Card.create({ sender, college, message, recipient_name, type });
    res.status(201).json({ success: true, card });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

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
    const authUser = req.user;
    // Only student can check this
    if (authUser.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can access card progress.",
      });
    }

    const studentId = authUser.id;
    const totalSent = await Card.countDocuments({ sender: studentId });
    const remaining = Math.max(5 - totalSent, 0);

    // Progress percentage (each card = 20%)
    let percentage = totalSent * 20;
    if (percentage > 100) percentage = 100;

    return res.status(200).json({
      success: true,
      message: "Card progress fetched successfully.",
      data: {
        totalSent,
        remaining,
        percentage,
        maxCards: 5,
      },
    });
  } catch (error) {
    console.error("Error getting card progress:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
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
    if (sentThisWeek >= 1) {
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

    // Fetch all cards
    const cards = await Card.find({ sender: studentId }).populate({ path: "college", select: "name" }).sort({ createdAt: -1 });
    const formatted = cards.map(card => ({
      id: card._id,
      recipient_name: card.recipient_name,
      message: card.message,
      college: card.college ? card.college.name : null,
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