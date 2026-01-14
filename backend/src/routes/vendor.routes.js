import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getMyVendorProfile, updateMyVendorProfile } from "../controllers/vendor.controller.js";
import upload from "../middleware/upload.middleware.js";
import { changePassword } from "../controllers/profile.controller.js";
import { updateCardStatus, getPrintedRewardCardsForVendor, verifyCardQR } from "../controllers/card.controller.js";
import { getVendorDashboard, getVendorNotifications } from "../controllers/dashboard.controller.js";
import { createVendorReward, getSingleVendorReward, getVendorRewards, updateVendorReward, deleteVendorReward } from "../controllers/vendorReward.controller.js";


const router = express.Router();

// Protect all routes with admin role
router.use(authenticate, authorizeRoles("vendor"));

// Profile
router.get("/profile", getMyVendorProfile);

router.put("/update-profile", upload.single("profileImage"), updateMyVendorProfile);


router.post("/create-reward", upload.single("rewardImage"), createVendorReward);
router.get("/reward/:id", getSingleVendorReward);
router.get("/rewards", getVendorRewards);
router.put("/update-reward/:id", upload.single("rewardImage"), updateVendorReward);
router.delete("/delete-reward/:id", deleteVendorReward);

//update card status
router.put("/cards/:cardId", updateCardStatus);

router.get("/notifications-and-activities", getVendorNotifications);

router.get("/dashboard", getVendorDashboard);

router.get("/printed-reward-cards", getPrintedRewardCardsForVendor);

router.post("/cards/verify-qr", verifyCardQR);


router.put("/change-password", changePassword);









export default router;