import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { createProfile, getProfile, updateProfile } from "../controllers/studentController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { isStudent } from "../middleware/roleMiddleware.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "cloudinary";
import multer from "multer";

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// ✅ Only profile photo goes to Cloudinary now — resume is a Drive link
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: async (req, file) => {
    if (file.fieldname === "profilePhoto") {
      return {
        folder: "profile_photos",
        resource_type: "image",
      };
    }
  },
});

const upload = multer({ storage });

const router = express.Router();

router.post(
  "/profile",
  authMiddleware,
  isStudent,
  upload.fields([{ name: "profilePhoto", maxCount: 1 }]),
  createProfile
);
router.get("/profile", authMiddleware, isStudent, getProfile);
router.put(
  "/profile",
  authMiddleware,
  isStudent,
  upload.fields([{ name: "profilePhoto", maxCount: 1 }]),
  updateProfile
);

export default router;