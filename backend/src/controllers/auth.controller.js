import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import University from "../models/university.model.js";

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
      college,
      studentUniId,
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
    const { name, email, password, phoneNumber, university } = req.body;

    if (!mongoose.Types.ObjectId.isValid(university)) {
      return res.status(400).json({ message: "Invalid university id" });
    }
    // console.log('university',university)
    const uniDoc = await University.findById(university);
    if (!uniDoc) return res.status(400).json({ message: "University not found" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const admin = await User.create({ name, email, password, phoneNumber, university, role: "admin" });
    res.status(201).json({ message: "Admin created successfully", admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Password Reset Code",
    html: `
      <div style="font-family: Arial; max-width: 600px; margin: auto;">
        <h2 style="background:#231f20; color:white; padding:15px; text-align:center">
          Password Reset Request
        </h2>

        <p style="font-size:16px; text-align:center">
          Use the 6-digit code below to reset your password:
        </p>

        <div style="padding:15px; background:#f8f8f8; border:2px dashed #231f20; text-align:center; margin:20px 0;">
          <span style="font-size:32px; font-weight:bold; letter-spacing:10px; color:#231f20;">
            ${resetCode}
          </span>
        </div>

        <p style="font-size:16px; text-align:center;">
          This code is valid for <strong>1 hour</strong>.
        </p>

        <p style="font-size:13px; color:gray; text-align:center; margin-top:20px;">
          If you did not request this, just ignore this email.
        </p>
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
