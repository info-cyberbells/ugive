import express from "express";
import { getUniversities, getCollegesByUniversity, getColleges } from "../controllers/university.controller.js";
import { requestResetPassword, verifyResetCodeAndChangePassword } from "../controllers/auth.controller.js";

const router = express.Router();

// Public routes (no authentication required)
router.get("/universities", getUniversities);
router.get("/colleges", getColleges);
router.get("/universities/:universityId/colleges", getCollegesByUniversity);

// Forgot password - send 6 digit OTP
router.post("/request-reset-password", requestResetPassword);

// Verify OTP & change password
router.post("/verify-reset-password", verifyResetCodeAndChangePassword);


export default router;