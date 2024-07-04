import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  deleteNotification,
  deleteAllNotifications,
} from "../controllers/notificationController.js";
const router = express.Router();

router.get("/", verifyToken, getAllNotifications);
router.delete("/", verifyToken, deleteAllNotifications);

export default router;
