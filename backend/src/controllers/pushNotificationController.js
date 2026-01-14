import PushNotification from "../models/PushNotification.js";
import User from "../models/user.model.js";

export const createPushNotification = async (req, res) => {
    try {
        const { title, message } = req.body;

        if (!title || !message) {
            return res.status(400).json({
                success: false,
                message: "Title and message are required",
            });
        }

        const user = await User.findById(req.user.id).select("university");

        if (!user || !user.university) {
            return res.status(400).json({
                success: false,
                message: "User university not found",
            });
        }

        await PushNotification.updateMany(
            {
                universityId: user.university,
                isActive: true,
            },
            { isActive: false }
        );

        const notification = await PushNotification.create({
            title,
            message,
            universityId: user.university,
            createdBy: req.user.id,
            isActive: true,
        });

        res.status(201).json({
            success: true,
            message: "Push notification created successfully",
            data: notification,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create push notification",
        });
    }
};


export const getAllPushNotifications = async (req, res) => {
    try {
        const notifications = await PushNotification.find()
            .sort({ createdAt: -1 });

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
        const student = await User.findById(req.user.id).select("university");

        if (!student || !student.university) {
            return res.status(400).json({
                success: false,
                message: "Student university not found",
            });
        }

        const notifications = await PushNotification.find({
            universityId: student.university,
            isActive: true,
        }).sort({ createdAt: -1 });

        if (notifications.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    _id: "DEFAULT_NOTIFICATION",
                    title: "Card Update",
                    message:
                        "Your card status updates will appear here once a drop is scheduled.",
                    isDefault: true,
                },
            });
        }

        res.status(200).json({
            success: true,
            data: notifications,
        });

    } catch (error) {
        console.error(error);
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

        if (!notification.isActive) {
            await PushNotification.updateMany(
                {
                    universityId: notification.universityId,
                    _id: { $ne: notification._id },
                    isActive: true,
                },
                { isActive: false }
            );

            notification.isActive = true;
        }
        else {
            notification.isActive = false;
        }

        await notification.save();

        res.status(200).json({
            success: true,
            message: "Push notification status updated",
            data: notification,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to update notification",
        });
    }
};

export const updatePushNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, message } = req.body;

        const notification = await PushNotification.findById(id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Push notification not found",
            });
        }

        if (title !== undefined) notification.title = title;
        if (message !== undefined) notification.message = message;

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
