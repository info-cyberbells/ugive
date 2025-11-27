import User from "../models/user.model.js";
import University from "../models/university.model.js";
import College from "../models/college.model.js";
import bcrypt from "bcryptjs";

// Create new student
export const createStudentSuperAdmin = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            university,
            college,
            phoneNumber,
            studentUniId,
        } = req.body;

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        const uni = await University.findById(university);
        if (!uni) {
            return res.status(400).json({
                success: false,
                message: "Invalid University ID",
            });
        }

        if (college) {
            const col = await College.findById(college);
            if (!col) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid College ID",
                });
            }
        }


        const student = await User.create({
            name,
            email,
            password,
            role: "student",
            university,
            college,
            phoneNumber,
            studentUniId,
        });

        res.status(201).json({
            success: true,
            message: "Student created successfully",
            data: student,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};


//get all students
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

//get single Student
export const getSingleStudentSuperAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await User.findOne({ _id: id, role: "student" })
            .populate("university", "name city state postcode")
            .populate("college", "name city state postcode")
            .select("-password");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Student fetched successfully",
            data: student,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};



//update student
export const updateStudentSuperAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        let updates = req.body || {};   // FIX: prevents undefined crash

        const student = await User.findOne({ _id: id, role: "student" });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        // If password is updated → hash it again
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const allowed = [
            "name",
            "email",
            "university",
            "college",
            "phoneNumber",
            "studentUniId",
            "profileImage",
            "password",
        ];

        Object.keys(updates).forEach(key => {
            if (allowed.includes(key)) {
                student[key] = updates[key];
            }
        });

        await student.save();

        res.status(200).json({
            success: true,
            message: "Student updated successfully",
            data: student,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};



//delete Student
export const deleteStudentSuperAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await User.findOne({ _id: id, role: "student" });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Student deleted successfully",
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};


