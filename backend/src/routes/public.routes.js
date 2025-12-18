import express from "express";
import { getUniversities, getCollegesByUniversity, getColleges } from "../controllers/university.controller.js";
import { requestResetPassword, verifyResetCodeAndChangePassword } from "../controllers/auth.controller.js";
import {
    createFeatureLink,
    updateFeatureLink,
    getAllFeatureLinks,
    deleteFeatureLink
} from "../controllers/featureLink.controller.js";
import uploadFeatureIcon from "../middleware/uploadFeatureIcon.js";
import { getActiveVendorRewards } from "../controllers/reward.controller.js";


const router = express.Router();

// Public routes (no authentication required)
router.get("/universities", getUniversities);
router.get("/colleges", getColleges);
router.get("/universities/:universityId/colleges", getCollegesByUniversity);

// Forgot password - send 6 digit OTP
router.post("/request-reset-password", requestResetPassword);

// Verify OTP & change password
router.post("/verify-reset-password", verifyResetCodeAndChangePassword);




router.post("/create-social-link", uploadFeatureIcon.single("icon"), createFeatureLink);       // Create
router.get("/get-all-social-links", getAllFeatureLinks);        // Get all
router.put("/update-link/:id", uploadFeatureIcon.single("icon"), updateFeatureLink);  // Update
router.delete("/delete-link/:id", deleteFeatureLink);   // Delete



router.get("/active-rewards", getActiveVendorRewards);




export default router;