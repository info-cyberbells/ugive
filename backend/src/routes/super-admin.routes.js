import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getProfile, updateProfile, changePassword } from "../controllers/profile.controller.js";
import { createUniversity, createCollege, updateUniversity, updateCollege, deleteUniversity, deleteCollege, getAllUniversitiesSuperAdmin, getAllCollegesSuperAdmin, getSingleUniversitySuperAdmin, getSingleCollegeSuperAdmin } from "../controllers/university.controller.js";
import { getAllStudentsSuperAdmin, createStudentSuperAdmin, getSingleStudentSuperAdmin, updateStudentSuperAdmin, deleteStudentSuperAdmin, } from "../controllers/student.controller.js";
import upload from "../middleware/upload.middleware.js";
import uploadReward from "../middleware/uploadReward.middleware.js";
import { createReward, getRewards, getSingleReward, updateReward, deleteReward, getAllVendorRewardsForSuperAdmin, setVendorRewardActiveStatus } from "../controllers/reward.controller.js";
import { getAllFeedback, updateFeedback, deleteFeedback } from "../controllers/feedback.controller.js";
import { getSuperAdminDashboard, getSuperAdminEvents } from "../controllers/dashboard.controller.js";
import { createAdmin, getAllAdmins, getSingleAdmin, updateAdmin, deleteAdmin } from "../controllers/auth.controller.js";
import { createVendor, getAllVendors, getSingleVendor, getMyVendorProfile, updateVendor, deleteVendor } from "../controllers/vendor.controller.js";
import { createVendorReward, getSingleVendorReward, getVendorRewards, updateVendorReward, deleteVendorReward } from "../controllers/vendorReward.controller.js";




const router = express.Router();

// Protect all routes with super_admin role
router.use(authenticate, authorizeRoles("super_admin"));

// Profile
router.get("/profile", getProfile);
router.put("/profile", upload.single("profileImage"), updateProfile);
router.put("/change-password", changePassword);


// University & College Management
router.post("/universities", createUniversity);
router.put("/universities/:id", updateUniversity);
router.delete("/universities/:id", deleteUniversity);
router.get("/get-all-universities", getAllUniversitiesSuperAdmin);
router.get("/universities/:id", getSingleUniversitySuperAdmin);


router.post("/create-admin", createAdmin);
router.get("/admins", getAllAdmins);
router.get("/admins/:id", getSingleAdmin);
router.put("/admins/:id", updateAdmin);
router.delete("/admins/:id", deleteAdmin);



//Student Management'
router.post("/create-student", createStudentSuperAdmin);
router.get("/get-all-students", getAllStudentsSuperAdmin);
router.get("/students/:id", getSingleStudentSuperAdmin);
router.put("/update-students/:id", updateStudentSuperAdmin);
router.delete("/delete-students/:id", deleteStudentSuperAdmin);

//vendor managment
router.post("/create-vendor", upload.single("profileImage"), createVendor);
router.get("/vendors", getAllVendors);
router.get("/vendors/:id", getSingleVendor);
router.get("/vendor/profile", getMyVendorProfile);
router.put("/update-vendor/:id", upload.single("profileImage"), updateVendor);
router.delete("/delete-vendor/:id", deleteVendor);


//college routes
router.post("/colleges", createCollege);
router.put("/colleges/:id", updateCollege);
router.delete("/colleges/:id", deleteCollege);
router.get("/get-all-colleges", getAllCollegesSuperAdmin);
router.get("/colleges/:id", getSingleCollegeSuperAdmin);


//reward routes
router.post("/create-reward", uploadReward.single("rewardImage"), createReward);
router.get("/get-all-rewards", getRewards);
router.get("/get-reward/:id", getSingleReward);
router.put("/update-reward/:id", uploadReward.single("rewardImage"), updateReward);
router.delete("/delete-reward/:id", deleteReward);

//feedback routes
router.put("/update-feedback/:id", updateFeedback);
router.delete("/delete-feedback/:id", deleteFeedback);
router.get("/get-all-feedback", getAllFeedback);

router.get("/dashboard", getSuperAdminDashboard);
router.get("/notifications-and-activities", getSuperAdminEvents);


router.get("/vendor-rewards", getAllVendorRewardsForSuperAdmin);

router.put("/vendor-rewards/:id", setVendorRewardActiveStatus);


//create reward
router.post("/create-vendor-reward", upload.single("rewardImage"), createVendorReward);
router.get("/added-reward/:id", getSingleVendorReward);
router.get("/added-rewards", getVendorRewards);
router.put("/update-vendor-reward/:id", upload.single("rewardImage"), updateVendorReward);
router.delete("/delete-vendor-reward/:id", deleteVendorReward);




export default router;