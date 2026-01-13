import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getProfile, updateProfile, changePassword } from "../controllers/profile.controller.js";
import upload from "../middleware/upload.middleware.js";
import { createUniversity, createCollege, getSingleUniversity, getAllAdminColleges, getSingleCollege, getAllAdminUniversities, updateUniversity, updateCollege, deleteUniversity, deleteCollege } from "../controllers/university.controller.js";
import { getUniversityCardsForAdmin, updateCardStatus, deleteCardByAdmin, storeCardQR } from "../controllers/card.controller.js";
import { createStudentByAdmin, getAllStudentsByAdmin, getSingleStudentByAdmin, updateStudentByAdmin, deleteStudentByAdmin } from "../controllers/student.controller.js";
import { getAdminDashboard, getAdminNotifications } from "../controllers/dashboard.controller.js";
import { createFeedback } from "../controllers/feedback.controller.js";
import { createVendorByUniversityAdmin, getAllVendors, getSingleVendor, getMyVendorProfile, updateVendor, deleteVendor } from "../controllers/vendor.controller.js";
import { createRewardByUniversityAdmin, getRewardsByUniversityAdmin, getSingleRewardByUniversityAdmin, updateRewardByUniversityAdmin, deleteRewardByUniversityAdmin } from "../controllers/reward.controller.js";
import { getActiveVendorRewardsForAdmin } from "../controllers/reward.controller.js";
import { createPushNotification, getAllPushNotifications, togglePushNotification, updatePushNotification, deletePushNotification } from "../controllers/pushNotificationController.js";




const router = express.Router();

// Protect all routes with admin role
router.use(authenticate, authorizeRoles("admin"));

// Profile
router.get("/profile", getProfile);
router.put("/profile", upload.single("profileImage"), updateProfile);

// University & College Management
// router.post("/universities", createUniversity);
// router.get("/universities", getAllAdminUniversities);
router.get("/universities/:id", getSingleUniversity);
// router.put("/universities/:id", updateUniversity);
// router.delete("/universities/:id", deleteUniversity);

router.post("/colleges", createCollege);
router.get("/colleges", getAllAdminColleges);
router.get("/colleges/:id", getSingleCollege);
router.put("/colleges/:id", updateCollege);
router.delete("/colleges/:id", deleteCollege);


//vendor managment
router.post("/create-vendor", upload.single("profileImage"), createVendorByUniversityAdmin);
router.get("/vendors", getAllVendors);
router.get("/vendors/:id", getSingleVendor);
router.get("/vendor/profile", getMyVendorProfile);
router.put("/update-vendor/:id", upload.single("profileImage"), updateVendor);
router.delete("/delete-vendor/:id", deleteVendor);

//students routes
router.post("/students", createStudentByAdmin);
router.get("/students", getAllStudentsByAdmin);
router.get("/students/:id", getSingleStudentByAdmin);
router.put("/students/:id", updateStudentByAdmin);
router.delete("/students/:id", deleteStudentByAdmin);

router.get("/cards", getUniversityCardsForAdmin);
router.put("/cards/:cardId", updateCardStatus);
router.delete("/cards/:cardId", deleteCardByAdmin);

router.post("/cards/store-qr", storeCardQR);



router.get("/dashboard", getAdminDashboard);
router.get("/get-notifications", getAdminNotifications);

router.post("/sent-feedback", createFeedback);
router.put("/change-password", changePassword);


router.post("/create-reward", upload.single("rewardImage"), createRewardByUniversityAdmin);
router.get("/rewards", getRewardsByUniversityAdmin);
router.get("/rewards/:id", getSingleRewardByUniversityAdmin);
router.put("/update-rewards/:id", upload.single("rewardImage"), updateRewardByUniversityAdmin);
router.delete("/delete-rewards/:id", deleteRewardByUniversityAdmin);

router.get("/active-rewards", getActiveVendorRewardsForAdmin);




router.post("/create-notifications", createPushNotification);
router.get("/get-all-notifications", getAllPushNotifications);
router.patch("/notifications/toggle/:id", togglePushNotification);
router.put("/notifications/:id", updatePushNotification);
router.delete("/notifications/:id", deletePushNotification);








export default router;