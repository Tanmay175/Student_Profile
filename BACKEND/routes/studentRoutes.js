import express from "express";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

import {
  createProfile,
  getProfile,
  updateProfile,
} from "../controllers/studentController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { isStudent } from "../middleware/roleMiddleware.js";

const router = express.Router();

// const storage = multer.diskStorage({
//   destination: "uploads/resumes",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: async (req, file) => {
    if (file.fieldname === "resume") {
      return {
        folder: "resumes",
        resource_type: "raw",
      };
    }

    if (file.fieldname === "profilePhoto") {
      return {
        folder: "profile_photos",
        resource_type: "image",
      };
    }
  },
});

const upload = multer({ storage });

// const upload = multer({ storage });

router.post("/profile", authMiddleware, isStudent, upload.fields([
  { name: "resume", maxCount: 1 },
  { name: "profilePhoto", maxCount: 1 },
]), createProfile);
router.get("/profile", authMiddleware, isStudent, getProfile);
// router.put("/profile", authMiddleware, isStudent, upload.single("resume"), updateProfile);
router.put("/profile", authMiddleware,isStudent,upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "profilePhoto", maxCount: 1 },
  ]),
  updateProfile
);

export default router;