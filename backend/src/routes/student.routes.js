import express from "express";
import upload from "../middleware/upload.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getProfile, updateProfile } from "../controllers/profile.controller.js";
import { createCard, getCardsByCollege, getCardProgress, checkCardEligibility, getSentCards } from "../controllers/card.controller.js";
import { sendFriendRequest, acceptFriendRequest, deleteFriendRequest, unfriendUser, getSentRequests, getReceivedRequests, getMyFriends } from "../controllers/manageFriends.controller.js";

const router = express.Router();

// Protect all routes with student role
router.use(authenticate, authorizeRoles("student"));

// Dashboard
router.get("/dashboard", (req, res) => {
  res.json({ message: "Student Dashboard Access Granted" });
});

// Profile
router.get("/profile", getProfile);
router.put("/profile", upload.single("profileImage"), updateProfile);

// Card Routes
router.post("/cards", createCard);
router.get("/cards/college/:collegeId", getCardsByCollege);
router.get("/remaining-cards", getCardProgress);
router.get("/check-card-eligibility", checkCardEligibility);
router.get("/sent-card-listing", getSentCards);

// Friends 
router.post("/friend/send", sendFriendRequest);
router.post("/friend/accept", acceptFriendRequest);
router.post("/friend/delete", deleteFriendRequest);
router.post("/friend/unfriend", unfriendUser);

router.get("/friend/sent", getSentRequests);
router.get("/friend/received", getReceivedRequests);
router.get("/friends", getMyFriends);

export default router;