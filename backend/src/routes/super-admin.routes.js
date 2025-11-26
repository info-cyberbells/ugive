import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getProfile, updateProfile } from "../controllers/profile.controller.js";
import { createUniversity, createCollege, updateUniversity, updateCollege, deleteUniversity, deleteCollege, getAllUniversitiesSuperAdmin, getAllCollegesSuperAdmin } from "../controllers/university.controller.js";
import { getAllStudentsSuperAdmin } from "../controllers/student.controller.js";


const router = express.Router();

// Protect all routes with super_admin role
router.use(authenticate, authorizeRoles("super_admin"));

// Dashboard
router.get("/dashboard", (req, res) => {
  res.json({ message: "Super Admin Panel Access Granted" });
});

// Profile
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

// University & College Management
router.post("/universities", createUniversity);
router.put("/universities/:id", updateUniversity);
router.delete("/universities/:id", deleteUniversity);

router.get("/get-all-universities", getAllUniversitiesSuperAdmin);
router.get("/get-all-colleges", getAllCollegesSuperAdmin);

//Student Management'
router.get("/get-all-students", getAllStudentsSuperAdmin);


router.post("/colleges", createCollege);
router.put("/colleges/:id", updateCollege);
router.delete("/colleges/:id", deleteCollege);


export default router;