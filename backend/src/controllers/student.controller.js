import User from "../models/user.model.js";
import University from "../models/university.model.js";
import College from "../models/college.model.js";
import bcrypt from "bcryptjs";
import NotificationActivity from "../models/notificationActivity.model.js";


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


        const student = await User.create({
            name,
            email,
            password,
            role: "student",
            university,
            college: college || null,
            phoneNumber,
            studentUniId,
        });
        await NotificationActivity.create({
            type: "activity",
            action: "student_created",
            message: `Superadmin added student ${name}`,
            createdBy: req.user.id
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


        const total = await User.countDocuments({ role: "student", isDeleted: { $ne: true } });

        const students = await User.find({ role: "student", isDeleted: { $ne: true } })
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

        await NotificationActivity.create({
            type: "activity",
            action: "student_updated",
            message: `Student ${student.name} updated`,
            createdBy: req.user.id
        });


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



//delete student account by himself
export const deleteMyAccount = async (req, res) => {
    try {
        const studentId = req.user.id;

        const user = await User.findByIdAndUpdate(
            studentId,
            { isDeleted: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Your account has been permanently deactivated.",
            user
        });

    } catch (error) {
        console.error("Delete account error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};




//admin controller

export const createStudentByAdmin = async (req, res) => {
    try {
        const admin = req.user;

        if (admin.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can create students"
            });
        }

        const {
            name,
            email,
            password,
            college,
            phoneNumber,
            studentUniId
        } = req.body;

        const university = admin.university; 

        if (!university) {
            return res.status(400).json({
                success: false,
                message: "Admin is not linked to any university"
            });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Student already exists"
            });
        }

        // ✅ Validate college
        if (college) {
            const validCollege = await College.findOne({
                _id: college,
                university
            });

            if (!validCollege) {
                return res.status(400).json({
                    success: false,
                    message: "College does not belong to admin university"
                });
            }
        }

        const student = await User.create({
            name,
            email,
            password,
            role: "student",
            university,
            college: college || null,
            phoneNumber,
            studentUniId
        });

        return res.status(201).json({
            success: true,
            message: "Student created successfully",
            data: student
        });

    } catch (error) {
        console.error("Create student error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};



//get all students
export const getAllStudentsByAdmin = async (req, res) => {
    try {
        const admin = req.user;

        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, parseInt(req.query.limit) || 10);
        const skip = (page - 1) * limit;

        const query = {
            role: "student",
            university: admin.university,
            isDeleted: { $ne: true }
        };

        const total = await User.countDocuments(query);

        const students = await User.find(query)
            .populate("college", "name")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("-password");

        return res.status(200).json({
            success: true,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            count: students.length,
            data: students
        });

    } catch (error) {
        console.error("Get students error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


//get single student
export const getSingleStudentByAdmin = async (req, res) => {
    try {
        const admin = req.user;
        const { id } = req.params;

        const student = await User.findOne({
            _id: id,
            role: "student",
            university: admin.university
        })
            .populate("college", "name")
            .select("-password");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: student
        });

    } catch (error) {
        console.error("Get single student error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


//update student
export const updateStudentByAdmin = async (req, res) => {
    try {
        const admin = req.user;
        const { id } = req.params;
        const updates = req.body;

        const student = await User.findOne({
            _id: id,
            role: "student",
            university: admin.university
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        // ✅ Validate college change
        if (updates.college) {
            const validCollege = await College.findOne({
                _id: updates.college,
                university: admin.university
            });

            if (!validCollege) {
                return res.status(400).json({
                    success: false,
                    message: "College does not belong to admin university"
                });
            }
        }

        // Password re-hash
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const allowedFields = [
            "name",
            "email",
            "college",
            "phoneNumber",
            "studentUniId",
            "password"
        ];

        allowedFields.forEach(field => {
            if (updates[field] !== undefined) {
                student[field] = updates[field];
            }
        });

        await student.save();

        return res.status(200).json({
            success: true,
            message: "Student updated successfully",
            data: student
        });

    } catch (error) {
        console.error("Update student error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


//delete student
export const deleteStudentByAdmin = async (req, res) => {
    try {
        const admin = req.user;
        const { id } = req.params;

        const student = await User.findOne({
            _id: id,
            role: "student",
            university: admin.university
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        await User.deleteOne({ _id: student._id });

        return res.status(200).json({
            success: true,
            message: "Student deleted successfully"
        });

    } catch (error) {
        console.error("Delete student error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};



