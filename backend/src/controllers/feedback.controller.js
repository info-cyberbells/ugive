import { Feedback } from "../models/feedback.model.js";

// CREATE Feedback
export const createFeedback = async (req, res) => {
    try {
        const userId = req.user.id;
        const { feedback } = req.body;

        if (!feedback || feedback.trim() === "") {
            return res.status(400).json({ success: false, message: "Feedback is required" });
        }

        const newFeedback = await Feedback.create({
            user: userId,
            feedback
        });

        return res.status(201).json({
            success: true,
            message: "Feedback submitted successfully",
            data: newFeedback,
        });
    } catch (error) {
        console.error("Create feedback error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// GET all feedback (admin only or superadmin)
export const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: feedbacks.length,
            data: feedbacks
        });
    } catch (error) {
        console.error("Get feedback error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// GET my feedback only (student)
export const getMyFeedback = async (req, res) => {
    try {
        const userId = req.user.id;

        const feedback = await Feedback.find({ user: userId }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: feedback.length,
            data: feedback
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// UPDATE Feedback
export const updateFeedback = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { feedback } = req.body;

        const fb = await Feedback.findById(id);

        if (!fb) return res.status(404).json({ success: false, message: "Feedback not found" });

        if (fb.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Not allowed" });
        }

        fb.feedback = feedback || fb.feedback;
        await fb.save();

        return res.status(200).json({
            success: true,
            message: "Feedback updated",
            data: fb
        });
    } catch (error) {
        console.error("Update feedback error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// DELETE Feedback
export const deleteFeedback = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const fb = await Feedback.findById(id);
        if (!fb) return res.status(404).json({ success: false, message: "Feedback not found" });

        if (fb.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Not allowed" });
        }

        await fb.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Feedback deleted successfully"
        });
    } catch (error) {
        console.error("Delete feedback error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
