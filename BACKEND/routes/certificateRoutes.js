import express from "express";
import {
  getCertificates,
  uploadCertificate,
  updateCertificate,
  deleteCertificate,
} from "../controllers/certificateController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { isStudent } from "../middleware/roleMiddleware.js";

const router = express.Router();

// GET  /api/certificates/:studentId
router.get("/:studentId", authMiddleware, getCertificates);

// POST /api/certificates  — body: { title, category, driveLink }
router.post("/", authMiddleware, isStudent, uploadCertificate);

// PUT  /api/certificates/:id
router.put("/:id", authMiddleware, isStudent, updateCertificate);

// DELETE /api/certificates/:id
router.delete("/:id", authMiddleware, isStudent, deleteCertificate);

export default router;