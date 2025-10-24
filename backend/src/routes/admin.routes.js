import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getProfile, updateProfile } from "../controllers/profile.controller.js";
import { createUniversity, createCollege } from "../controllers/university.controller.js";

const router = express.Router();

// Protect all routes with admin role
router.use(authenticate, authorizeRoles("admin"));

// Dashboard
router.get("/dashboard", (req, res) => {
  res.json({ message: "Admin Dashboard Access Granted" });
});

// Profile
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

// University & College Management
router.post("/universities", createUniversity);
router.post("/colleges", createCollege);

export default router;