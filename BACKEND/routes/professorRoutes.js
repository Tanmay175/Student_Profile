import express from "express";

import {
  getBatches,
  getStudentsByBatch,
  getStudentDetails,
  getAllStudents,
  getStudentsByBatchWithProfiles,
  deleteStudent,
} from "../controllers/professorController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { isProfessor } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/batches", authMiddleware, isProfessor, getBatches);
router.get("/batch/:year", authMiddleware, isProfessor, getStudentsByBatch);
router.get("/student/:id", authMiddleware, isProfessor, getStudentDetails);
router.get("/students", authMiddleware, isProfessor, getAllStudents);
router.get("/batch-leaderboard/:batch", authMiddleware, isProfessor, getStudentsByBatchWithProfiles);
router.delete("/student/:id", authMiddleware, isProfessor, deleteStudent);

export default router;