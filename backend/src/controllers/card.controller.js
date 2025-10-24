import Card from "../models/card.model.js";

// Create a new Card
export const createCard = async (req, res) => {
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
