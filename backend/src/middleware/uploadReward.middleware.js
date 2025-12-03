import fs from "fs";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = "uploads/reward-images";

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, "uploads/reward-images");
    },

    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const filename = `reward_${Date.now()}${ext}`;
        cb(null, filename);
    },
});

const uploadReward = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
        if (!allowed.includes(file.mimetype)) {
            return cb(new Error("Only images allowed (JPEG, PNG, WEBP)"));
        }
        cb(null, true);
    },
});

export default uploadReward;
