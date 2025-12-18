import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import University from "../models/university.model.js";
import College from "../models/college.model.js";
import NotificationActivity from "../models/notificationActivity.model.js";

const buildImageUrl = (req, path) => {
  if (!path) return null;
  return `${req.protocol}://${req.get("host")}${path}`;
};


// Register
export const register = async (req, res) => {
  try {
    const { name, email, password, role, university, college, phoneNumber, studentUniId } = req.body;
    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    // Restrict student domain
    if (role === "student") {
      const allowedDomain = process.env.STUDENT_EMAIL_DOMAIN || "@usq.edu.au";
      if (!email.endsWith(allowedDomain)) {
        return res.status(400).json({
          message: `Invalid email domain. Only official student emails (${allowedDomain}) are allowed.`,
        });
      }
    }

    // Prevent role escalation
    if (role === "admin" || role === "super_admin") {
      return res.status(403).json({ message: "You cannot assign this role manually" });
    }

    if (!mongoose.Types.ObjectId.isValid(university)) {
      return res.status(400).json({ message: "Invalid university id" });
    }

    const uniDoc = await University.findById(university);
    if (!uniDoc) return res.status(400).json({ message: "University not found" });

    // Create user with all fields
    const user = await User.create({
      name,
      email,
      password,
      role: "student",
      university,
      phoneNumber,
      college: college || null,
      studentUniId,
    });

    await NotificationActivity.create({
      type: "notification",
      action: "user_registered",
      message: `${name} joined the platform`,
      createdBy: user._id
    });

    res.status(201).json({ message: "Student registered successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (user.isDeleted) {
      return res.status(403).json({
        success: false,
        message: "This account has been deactivated."
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Only Super Admin can create Admin users
export const createAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phoneNumber,
      university,
      colleges
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(university)) {
      return res.status(400).json({ message: "Invalid university id" });
    }

    const uniDoc = await University.findById(university);
    if (!uniDoc) {
      return res.status(400).json({ message: "University not found" });
    }

    const existingAdminForUniversity = await User.findOne({
      university: university,
      role: "admin"
    });

    if (existingAdminForUniversity) {
      return res.status(400).json({
        message: "An admin already exists for this university"
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    let collegeIds = [];

    if (colleges) {
      collegeIds = Array.isArray(colleges)
        ? colleges
        : colleges.split(",").map(id => id.trim());


      for (const collegeId of collegeIds) {
        if (!mongoose.Types.ObjectId.isValid(collegeId)) {
          return res.status(400).json({
            message: `Invalid college id: ${collegeId}`
          });
        }
      }

      const validColleges = await College.find({
        _id: { $in: collegeIds },
        university: university
      });

      if (validColleges.length !== collegeIds.length) {
        return res.status(400).json({
          message: "One or more colleges do not belong to the selected university"
        });
      }
    }


    const admin = await User.create({
      name,
      email,
      password,
      phoneNumber,
      university,
      colleges: collegeIds,
      role: "admin"
    });

    // ✅ Log activity
    await NotificationActivity.create({
      type: "activity",
      action: "admin_created",
      message: `Admin ${name} created`,
      createdBy: req.user.id
    });

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin
    });

  } catch (err) {
    console.error("Create admin error:", err);
    return res.status(500).json({ message: err.message });
  }
};

//get all admins
export const getAllAdmins = async (req, res) => {
  try {
    if (req.user.role !== "super_admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
    const skip = (page - 1) * limit;

    const totalAdmins = await User.countDocuments({ role: "admin" });

    const admins = await User.find({ role: "admin" })
      .populate("university", "name city state")
      .populate("colleges", "name")
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const formattedAdmins = admins.map(admin => ({
      ...admin,
      profileImage: buildImageUrl(req, admin.profileImage)
    }));

    return res.status(200).json({
      success: true,
      pagination: {
        page,
        limit,
        total: totalAdmins,
        totalPages: Math.ceil(totalAdmins / limit)
      },
      data: formattedAdmins
    });

  } catch (error) {
    console.error("Get all admins error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};




//get single admin
export const getSingleAdmin = async (req, res) => {
  try {
    if (req.user.role !== "super_admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { id } = req.params;

    const admin = await User.findOne({
      _id: id,
      role: "admin"
    })
      .populate("university", "name city state postcode")
      .populate("colleges", "name")
      .select("-password")
      .lean();

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    admin.profileImage = buildImageUrl(req, admin.profileImage);

    return res.status(200).json({
      success: true,
      data: admin
    });

  } catch (error) {
    console.error("Get single admin error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


//update admin
export const updateAdmin = async (req, res) => {
  try {
    if (req.user.role !== "super_admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { id } = req.params;
    const { name, phoneNumber, colleges } = req.body;

    const admin = await User.findOne({
      _id: id,
      role: "admin",
      isDeleted: { $ne: true }
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    // Update basic fields
    if (name) admin.name = name;
    if (phoneNumber) admin.phoneNumber = phoneNumber;

    // Update colleges (must belong to admin university)
    if (colleges) {
      const collegeIds = Array.isArray(colleges)
        ? colleges
        : colleges.split(",").map(id => id.trim());

      for (const collegeId of collegeIds) {
        if (!mongoose.Types.ObjectId.isValid(collegeId)) {
          return res.status(400).json({
            message: `Invalid college id: ${collegeId}`
          });
        }
      }

      const validColleges = await College.find({
        _id: { $in: collegeIds },
        university: admin.university
      });

      if (validColleges.length !== collegeIds.length) {
        return res.status(400).json({
          message: "One or more colleges do not belong to admin university"
        });
      }

      admin.colleges = collegeIds;
    }

    await admin.save();

    await NotificationActivity.create({
      type: "activity",
      action: "admin_updated",
      message: `Admin ${admin.name} updated`,
      createdBy: req.user.id,
      meta: { adminId: admin._id }
    });

    return res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      data: admin
    });

  } catch (error) {
    console.error("Update admin error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

//delete admin
export const deleteAdmin = async (req, res) => {
  try {
    if (req.user.role !== "super_admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { id } = req.params;

    const admin = await User.findOne({
      _id: id,
      role: "admin"
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    // 🔥 HARD DELETE
    await User.findByIdAndDelete(id);

    await NotificationActivity.create({
      type: "activity",
      action: "admin_deleted",
      message: `Admin ${admin.name} permanently deleted`,
      createdBy: req.user.id,
      meta: { adminId: id }
    });

    return res.status(200).json({
      success: true,
      message: "Admin deleted permanently"
    });

  } catch (error) {
    console.error("Delete admin error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};



//Request reset password
export const requestResetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "No account found with this email." });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetCode = resetCode;
    user.resetCodeExpires = Date.now() + 3600000;
    await user.save();

    await sendResetEmail(email, resetCode);

    res.status(200).json({
      message: "A 6-digit reset code has been sent to your email."
    });

  } catch (error) {
    console.error("Error requesting reset:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const sendResetEmail = async (email, resetCode) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"UGIVE Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "UGIVE - Your Password Reset Code",
    html: `
      <div style="background:#f5f5f7; padding:30px 0; font-family: Arial, sans-serif;">
        <div style="
          max-width:600px; 
          margin:auto; 
          background:white; 
          border-radius:12px; 
          box-shadow:0 4px 15px rgba(0,0,0,0.08); 
          overflow:hidden;
        ">

          <!-- HEADER -->
          <div style="background:#4A3AFF; padding:20px; text-align:center;">
            <h2 style="color:white; margin:0; font-size:24px; letter-spacing:1px;">
              UGIVE Password Reset
            </h2>
          </div>

          <!-- BODY -->
          <div style="padding:30px;">
            <p style="font-size:16px; color:#333; text-align:center;">
              Hello Student,<br><br>
              You requested to reset your UGIVE account password.
            </p>

            <p style="font-size:15px; color:#666; text-align:center;">
              Enter the 6-digit verification code below:
            </p>

            <!-- RESET CODE BOX -->
            <div style="
              background:#f0f0ff; 
              padding:20px; 
              text-align:center; 
              margin:20px 0; 
              border-radius:10px; 
              border:2px dashed #4A3AFF;
            ">
              <span style="
                font-size:36px; 
                font-weight:bold; 
                letter-spacing:10px; 
                color:#4A3AFF;
              ">
                ${resetCode}
              </span>
            </div>

            <p style="font-size:14px; color:#555; text-align:center;">
              This code is valid for <strong>1 hour</strong>.  
              Do not share it with anyone.
            </p>

            <p style="font-size:13px; color:#999; text-align:center; margin-top:25px;">
              If you didn’t request this, you can safely ignore this email.
            </p>
          </div>

          <!-- FOOTER -->
          <div style="
            background:#fafafa; 
            padding:15px; 
            text-align:center; 
            font-size:12px; 
            color:#999;
          ">
            © ${new Date().getFullYear()} UGIVE · Empowering Students
          </div>

        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};




//VERIFY RESET CODE & CHANGE PASSWORD
export const verifyResetCodeAndChangePassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const user = await User.findOne({
      email,
      resetCode: code,
      resetCodeExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset code." });
    }

    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({
        message: "New password cannot be the same as your current password."
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.resetCode = undefined;
    user.resetCodeExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password updated successfully!" });

  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
};
