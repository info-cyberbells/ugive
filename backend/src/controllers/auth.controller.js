import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Register
export const register = async (req, res) => {
  try {
    const { name, email, password, role, university, phoneNumber, studentUniId } = req.body;
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

    // Create user with all fields
    const user = await User.create({
      name,
      email,
      password,
      role: "student",
      university,
      phoneNumber,
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
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const admin = await User.create({ name, email, password, phoneNumber, university, role: "admin" });
    res.status(201).json({ message: "Admin created successfully", admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
