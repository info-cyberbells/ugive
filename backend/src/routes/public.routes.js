import express from "express";
import { getUniversities, getCollegesByUniversity } from "../controllers/university.controller.js";

const router = express.Router();

// Public routes (no authentication required)
router.get("/universities", getUniversities);
router.get("/universities/:universityId/colleges", getCollegesByUniversity);

export default router;