import express from "express";
import multer from "multer";

import {
  createProfile,
  getProfile,
  updateProfile,
} from "../controllers/studentController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { isStudent } from "../middleware/roleMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/resumes",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/profile", authMiddleware, isStudent, upload.single("resume"), createProfile);
router.get("/profile", authMiddleware, isStudent, getProfile);
router.put("/profile", authMiddleware, isStudent, upload.single("resume"), updateProfile);

export default router;