import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getProfile, updateProfile } from "../controllers/profile.controller.js";
import upload from "../middleware/upload.middleware.js";
import { createUniversity, createCollege, getSingleUniversity, getAllAdminColleges, getSingleCollege, getAllAdminUniversities, updateUniversity, updateCollege, deleteUniversity, deleteCollege } from "../controllers/university.controller.js";

const router = express.Router();

// Protect all routes with admin role
router.use(authenticate, authorizeRoles("admin"));

// Dashboard
router.get("/dashboard", (req, res) => {
  res.json({ message: "Admin Dashboard Access Granted" });
});

// Profile
router.get("/profile", getProfile);
router.put("/profile", upload.single("profileImage"), updateProfile);

// University & College Management
router.post("/universities", createUniversity);
router.get("/universities", getAllAdminUniversities);
router.get("/universities/:id", getSingleUniversity);
router.put("/universities/:id", updateUniversity);
router.delete("/universities/:id", deleteUniversity);

router.post("/colleges", createCollege);
router.get("/colleges", getAllAdminColleges);
router.get("/colleges/:id", getSingleCollege);
router.put("/colleges/:id", updateCollege);
router.delete("/colleges/:id", deleteCollege);

export default router;