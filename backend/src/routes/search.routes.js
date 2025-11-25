import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { searchStudents } from "../controllers/search.controller.js";

const router = express.Router();

// All authenticated users can search (or restrict to students by adding authorizeRoles)
router.get("/", authenticate, searchStudents);

export default router;
