import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getProfile, updateProfile, changeSuperAdminPassword  } from "../controllers/profile.controller.js";
import { createUniversity, createCollege, updateUniversity, updateCollege, deleteUniversity, deleteCollege, getAllUniversitiesSuperAdmin, getAllCollegesSuperAdmin, getSingleUniversitySuperAdmin, getSingleCollegeSuperAdmin } from "../controllers/university.controller.js";
import { getAllStudentsSuperAdmin, createStudentSuperAdmin, getSingleStudentSuperAdmin, updateStudentSuperAdmin, deleteStudentSuperAdmin, } from "../controllers/student.controller.js";
import upload from "../middleware/upload.middleware.js";



const router = express.Router();

// Protect all routes with super_admin role
router.use(authenticate, authorizeRoles("super_admin"));

// Dashboard
router.get("/dashboard", (req, res) => {
  res.json({ message: "Super Admin Panel Access Granted" });
});

// Profile
router.get("/profile", getProfile);
router.put("/profile", upload.single("profileImage"), updateProfile);
router.put("/change-password", changeSuperAdminPassword);


// University & College Management
router.post("/universities", createUniversity);
router.put("/universities/:id", updateUniversity);
router.delete("/universities/:id", deleteUniversity);
router.get("/get-all-universities", getAllUniversitiesSuperAdmin);
router.get("/universities/:id", getSingleUniversitySuperAdmin);



//Student Management'
router.post("/create-student", createStudentSuperAdmin);
router.get("/get-all-students", getAllStudentsSuperAdmin);
router.get("/students/:id", getSingleStudentSuperAdmin);
router.put("/update-students/:id", updateStudentSuperAdmin);
router.delete("/delete-students/:id", deleteStudentSuperAdmin);


//college routes
router.post("/colleges", createCollege);
router.put("/colleges/:id", updateCollege);
router.delete("/colleges/:id", deleteCollege);
router.get("/get-all-colleges", getAllCollegesSuperAdmin);
router.get("/colleges/:id", getSingleCollegeSuperAdmin);



export default router;