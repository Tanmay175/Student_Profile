import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { isProfessor, isStudent } from "../middleware/roleMiddleware.js";
import {
  sendNotification,
  getSentNotifications,
  deleteNotification,
  getMyNotifications,
  markAsRead,
  markAllRead,
  getUnreadCount,
} from "../controllers/notificationController.js";

const router = express.Router();

// Professor routes
router.post("/send", authMiddleware, isProfessor, sendNotification);
router.get("/sent", authMiddleware, isProfessor, getSentNotifications);
router.delete("/:id", authMiddleware, isProfessor, deleteNotification);

// Student routes
router.get("/my", authMiddleware, isStudent, getMyNotifications);
router.put("/read/:id", authMiddleware, isStudent, markAsRead);
router.put("/read-all", authMiddleware, isStudent, markAllRead);
router.get("/unread-count", authMiddleware, isStudent, getUnreadCount);

export default router;
