import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import superAdminRoutes from "./src/routes/super-admin.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import studentRoutes from "./src/routes/student.routes.js";
import publicRoutes from "./src/routes/public.routes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Mount routes with role-based prefixes
app.use("/api/auth", authRoutes);
app.use("/api/super_admin", superAdminRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/public", publicRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));