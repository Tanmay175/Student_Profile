// BACKEND/routes/certificateRoutes.js
import express from "express";
import {
  getCertificates,
  uploadCertificate,
  updateCertificate,
  deleteCertificate,
  getCertificateCount,
} from "../controllers/certificateController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { isStudent, isProfessor } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ✅ FIXED: Only professor OR the student themselves can query cert count
// We use a custom middleware inline instead of isStudent/isProfessor alone
const canViewCount = (req, res, next) => {
  const { studentId } = req.params;
  const isProfRole = req.user.role === "professor";
  const isOwner = req.user._id.toString() === studentId;
  if (isProfRole || isOwner) return next();
  return res.status(403).json({ success: false, message: "Access denied." });
};

// GET  /api/certificates/count/:studentId
router.get("/count/:studentId", authMiddleware, canViewCount, getCertificateCount);

// GET  /api/certificates/:studentId
router.get("/:studentId", authMiddleware, getCertificates);

// POST /api/certificates
router.post("/", authMiddleware, isStudent, uploadCertificate);

// PUT  /api/certificates/:id
router.put("/:id", authMiddleware, isStudent, updateCertificate);

// DELETE /api/certificates/:id
router.delete("/:id", authMiddleware, isStudent, deleteCertificate);

export default router;