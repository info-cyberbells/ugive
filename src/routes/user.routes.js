import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// Accessible by all logged-in users
router.get("/profile", authenticate, (req, res) => {
  res.json({ message: "Profile fetched successfully", user: req.user });
});

// Only Admin & Super Admin
router.get("/admin-dashboard", authenticate, authorizeRoles("admin", "super_admin"), (req, res) => {
  res.json({ message: "Admin Dashboard Access Granted" });
});

// Only Super Admin
router.get("/super-admin-panel", authenticate, authorizeRoles("super_admin"), (req, res) => {
  res.json({ message: "Super Admin Panel Access Granted" });
});

// Only Students
router.get("/student-dashboard", authenticate, authorizeRoles("student"), (req, res) => {
  res.json({ message: "Student Dashboard Access Granted" });
});

export default router;
