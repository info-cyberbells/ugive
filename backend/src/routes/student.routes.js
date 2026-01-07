import express from "express";
import upload from "../middleware/upload.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getProfile, updateProfile, changePassword } from "../controllers/profile.controller.js";
import { createCard, getCardsByCollege, getCardProgress, checkCardEligibility, getSentCards } from "../controllers/card.controller.js";
import { sendFriendRequest, acceptFriendRequest, deleteFriendRequest, unfriendUser, getSentRequests, getReceivedRequests, getMyFriends, getMyCollegeUsers } from "../controllers/manageFriends.controller.js";
import { getStudentRewards, claimReward } from "../controllers/reward.controller.js";
import { deleteMyAccount } from "../controllers/student.controller.js";
import { createFeedback, getMyFeedback } from "../controllers/feedback.controller.js";
import { getStudentStreakAndRewards } from "../controllers/getStudentStreakAndRewards.controller.js";
import { getStudentDashboard, getStudentNotifications } from "../controllers/dashboard.controller.js";


const router = express.Router();

// Protect all routes with student role
router.use(authenticate, authorizeRoles("student"));

// Profile
router.get("/profile", getProfile);
router.put("/profile", upload.single("profileImage"), updateProfile);
router.put("/change-password", changePassword);


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

router.get("/friend/college-friends", getMyCollegeUsers);


router.get("/friend/sent", getSentRequests);
router.get("/friend/received", getReceivedRequests);
router.get("/friends", getMyFriends);


//deete my account
router.post("/delete-account", deleteMyAccount);


//rewards 
router.get("/college-rewards", getStudentRewards);


router.post("/sent-feedback", createFeedback);
router.get("/my-feedback", getMyFeedback);
router.post("/rewards/claim", claimReward);




// GET student streak + rewards + weekly stats
router.get("/streak-summary", getStudentStreakAndRewards);


router.get("/student-dashboard", getStudentDashboard);
router.get("/get-my-notifications", getStudentNotifications);




export default router;