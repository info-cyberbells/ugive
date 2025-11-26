import User from "../models/user.model.js";

export const getAllStudentsSuperAdmin = async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query;
        page = Number(page);
        limit = Number(limit);


        const total = await User.countDocuments({ role: "student" });

        const students = await User.find({ role: "student" })
            .populate("university", "name city state")
            .populate("college", "name city state")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .select("-password");

        res.status(200).json({
            success: true,
            message: "Students fetched successfully",
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            data: students,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
