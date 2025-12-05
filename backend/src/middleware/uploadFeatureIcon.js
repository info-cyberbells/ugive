import fs from "fs";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = "uploads/feature-icons";

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },

    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const filename = `feature_${Date.now()}${ext}`;
        cb(null, filename);
    },
});

const uploadFeatureIcon = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
        if (!allowed.includes(file.mimetype)) {
            return cb(new Error("Only image files allowed (JPEG, PNG, JPG, WEBP)."));
        }
        cb(null, true);
    },
});

export default uploadFeatureIcon;
