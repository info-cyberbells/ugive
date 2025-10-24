import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getProfile, updateProfile } from "../controllers/profile.controller.js";
import { createCard, getCardsByCollege } from "../controllers/card.controller.js";

const router = express.Router();

// Protect all routes with student role
router.use(authenticate, authorizeRoles("student"));

// Dashboard
router.get("/dashboard", (req, res) => {
  res.json({ message: "Student Dashboard Access Granted" });
});

// Profile
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

// Card Routes
router.post("/cards", createCard);
router.get("/cards/college/:collegeId", getCardsByCollege);

export default router;