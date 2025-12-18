import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import superAdminRoutes from "./src/routes/super-admin.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import studentRoutes from "./src/routes/student.routes.js";
import publicRoutes from "./src/routes/public.routes.js";
import searchRoutes from "./src/routes/search.routes.js";
import vendorRutes from "./src/routes/vendor.routes.js"

connectDB();

const app = express();

// Middleware
app.set('trust proxy', true);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

// Static files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/super_admin", superAdminRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/vendor", vendorRutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));