import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getProfile, updateProfile } from "../controllers/profile.controller.js";

const router = express.Router();

// Common profile route for all authenticated users
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);

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
