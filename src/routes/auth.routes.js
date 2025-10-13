import express from "express";
import { register, login, createAdmin } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validateRegister } from "../validation/auth.validation.js";

const router = express.Router();

// Public
router.post("/register", validateRegister, register);
router.post("/register", register);
router.post("/login", login);

// Protected (Super Admin only)
router.post("/create-admin", authenticate, authorizeRoles("super_admin"), createAdmin);

export default router;
