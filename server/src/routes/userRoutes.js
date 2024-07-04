import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  getUserProfile,
  getSuggestedUsers,
  updateUserProfile,
  followUnfollowUser,
} from "../controllers/userController.js";
const router = express.Router();

router.get("/profile/:username", verifyToken, getUserProfile);
router.get("/suggested", verifyToken, getSuggestedUsers);
router.put("/update", verifyToken, updateUserProfile);
router.post("/follow/:id", verifyToken, followUnfollowUser);

export default router;
