import User from "../models/user.model.js";
import University from "../models/university.model.js";
import College from "../models/college.model.js";
import bcrypt from "bcryptjs";


export const createVendor = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phoneNumber,
            profileImage,
            university
        } = req.body;

        if (!university) {
            return res.status(400).json({
                success: false,
                message: "University is required for vendor"
            });
        }

        const uni = await University.findById(university);
        if (!uni) {
            return res.status(400).json({
                success: false,
                message: "Invalid university ID"
            });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Vendor already exists"
            });
        }

        const colleges = await College.find({ university }).select("_id");
        const collegeIds = colleges.map(c => c._id);

        const vendor = await User.create({
            name,
            email,
            password,
            phoneNumber,
            profileImage: profileImage || null,
            role: "vendor",
            university,
            colleges: collegeIds
        });

        return res.status(201).json({
            success: true,
            message: "Vendor created successfully",
            data: vendor
        });

    } catch (error) {
        console.error("Create vendor error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


export const getAllVendors = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, parseInt(req.query.limit) || 10);
        const skip = (page - 1) * limit;

        const query = {
            role: "vendor",
            isDeleted: { $ne: true }
        };

        const total = await User.countDocuments(query);

        const vendors = await User.find(query)
            .populate("university", "name")
            .populate("colleges", "name")
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
            data: vendors
        });

    } catch (error) {
        console.error("Get all vendors error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const getSingleVendor = async (req, res) => {
    try {
        const { id } = req.params;

        const vendor = await User.findOne({
            _id: id,
            role: "vendor",
            isDeleted: { $ne: true }
        })
            .populate("university", "name city state")
            .populate("colleges", "name")
            .select("-password");

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: vendor
        });

    } catch (error) {
        console.error("Get vendor error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const getMyVendorProfile = async (req, res) => {
    try {
        const vendorId = req.user.id;
        const baseURL = `${req.protocol}://${req.get("host")}`;

        const vendor = await User.findOne({
            _id: vendorId,
            role: "vendor",
            isDeleted: { $ne: true }
        })
            .populate("university", "name city state")
            .populate("colleges", "name")
            .select("-password");

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }
        const vendorResponse = vendor.toObject();

        if (vendorResponse.profileImage) {
            vendorResponse.profileImage = `${baseURL}${vendorResponse.profileImage}`;
        }

        return res.status(200).json({
            success: true,
            data: vendorResponse
        });

    } catch (error) {
        console.error("Get my vendor profile error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const updateVendor = async (req, res) => {
    try {
        const vendorId = req.params.id || req.user.id;
        const updates = req.body || {};

        const vendor = await User.findOne({
            _id: vendorId,
            role: "vendor"
        }).select("-password");

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        if (updates.university) {
            const uni = await University.findById(updates.university);
            if (!uni) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid university ID"
                });
            }

            const colleges = await College.find({
                university: updates.university
            }).select("_id");

            vendor.university = updates.university;
            vendor.colleges = colleges.map(c => c._id);
        }



        const allowedFields = [
            "name",
            "email",
            "phoneNumber",
            "profileImage",
        ];

        allowedFields.forEach(field => {
            if (updates[field] !== undefined) {
                vendor[field] = updates[field];
            }
        });

        await vendor.save();

        return res.status(200).json({
            success: true,
            message: "Vendor updated successfully",
            data: vendor
        });

    } catch (error) {
        console.error("Update vendor error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


export const deleteVendor = async (req, res) => {
    try {
        const { id } = req.params;

        const vendor = await User.findOne({
            _id: id,
            role: "vendor"
        });

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        await User.deleteOne({ _id: id });

        return res.status(200).json({
            success: true,
            message: "Vendor deleted permanently"
        });

    } catch (error) {
        console.error("Delete vendor error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

//admin univ create  vendor
export const createVendorByUniversityAdmin = async (req, res) => {
    try {
        const admin = req.user;

        if (admin.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only university admin can create vendor"
            });
        }

        if (!admin.university) {
            return res.status(400).json({
                success: false,
                message: "Admin is not linked to any university"
            });
        }

        const {
            name,
            email,
            password,
            phoneNumber,
            profileImage
        } = req.body;

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Vendor already exists"
            });
        }

        const university = admin.university;

        const colleges = await College.find({ university }).select("_id");
        const collegeIds = colleges.map(c => c._id);

        const vendor = await User.create({
            name,
            email,
            password,
            phoneNumber,
            profileImage: profileImage || null,
            role: "vendor",
            university,
            colleges: collegeIds
        });

        return res.status(201).json({
            success: true,
            message: "Vendor created successfully",
            data: {
                _id: vendor._id,
                name: vendor.name,
                email: vendor.email,
                role: vendor.role,
                university: vendor.university,
                colleges: vendor.colleges
            }
        });

    } catch (error) {
        console.error("Create vendor by admin error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const updateMyVendorProfile = async (req, res) => {
    try {
        const vendorId = req.user.id; // from JWT
        const updates = req.body || {};

        const vendor = await User.findOne({
            _id: vendorId,
            role: "vendor",
            isDeleted: { $ne: true }
        });

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        // ❌ Block password update
        if (updates.password) {
            return res.status(400).json({
                success: false,
                message: "Password update is not allowed"
            });
        }

        // ❌ Block university / colleges update
        if (updates.university || updates.colleges) {
            return res.status(403).json({
                success: false,
                message: "University or colleges update is not allowed"
            });
        }

        // ✅ Allowed text fields
        const allowedFields = [
            "name",
            "email",
            "phoneNumber"
        ];

        allowedFields.forEach(field => {
            if (updates[field] !== undefined) {
                vendor[field] = updates[field];
            }
        });

        // ✅ Profile image from multer
        if (req.file) {
            vendor.profileImage = `/uploads/profile-images/${req.file.filename}`;
        }

        await vendor.save();

        const vendorResponse = vendor.toObject();
        delete vendorResponse.password;

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: vendorResponse
        });

    } catch (error) {
        console.error("Update vendor profile error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
};

