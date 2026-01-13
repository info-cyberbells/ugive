import PushNotification from "../models/PushNotification.js";


export const createPushNotification = async (req, res) => {
    try {
        const { title, message, scheduledAt } = req.body;

        if (!title || !message) {
            return res.status(400).json({
                success: false,
                message: "Title and message are required",
            });
        }

        const notification = await PushNotification.create({
            title,
            message,
            scheduledAt,
            createdBy: req.user.id,
        });

        res.status(201).json({
            success: true,
            message: "Push notification created successfully",
            data: notification,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create push notification",
        });
    }
};


export const getAllPushNotifications = async (req, res) => {
    try {
        const notifications = await PushNotification.find().sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            data: notifications,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch push notifications",
        });
    }
};


export const getStudentPushNotifications = async (req, res) => {
    try {
        const now = new Date();

        const notifications = await PushNotification.find({
            isActive: true,
            targetRole: "student",
            $or: [
                { scheduledAt: null },
                { scheduledAt: { $lte: now } },
            ],
        }).sort({ createdAt: -1 });

        if (notifications.length === 0) {
            return res.status(200).json({
                success: true,
                data: [
                    {
                        _id: "DEFAULT_NOTIFICATION",
                        title: "Card Update",
                        message:
                            "Your card status updates will appear here once a drop is scheduled.",
                        isDefault: true,
                    },
                ],
            });
        }

        res.status(200).json({
            success: true,
            data: notifications,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch notifications",
        });
    }
};



export const togglePushNotification = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await PushNotification.findById(id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Push notification not found",
            });
        }

        notification.isActive = !notification.isActive;
        await notification.save();

        res.status(200).json({
            success: true,
            message: "Push notification status updated",
            data: notification,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update notification",
        });
    }
};


export const updatePushNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, message, scheduledAt, isActive } = req.body;

        const notification = await PushNotification.findById(id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Push notification not found",
            });
        }

        if (title !== undefined) notification.title = title;
        if (message !== undefined) notification.message = message;
        if (scheduledAt !== undefined) notification.scheduledAt = scheduledAt;
        if (isActive !== undefined) notification.isActive = isActive;

        await notification.save();

        res.status(200).json({
            success: true,
            message: "Push notification updated successfully",
            data: notification,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update push notification",
        });
    }
};



export const deletePushNotification = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await PushNotification.findById(id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Push notification not found",
            });
        }

        await notification.deleteOne();

        res.status(200).json({
            success: true,
            message: "Push notification deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete push notification",
        });
    }
};
