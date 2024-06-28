import express from "express";
import { verifyToken, verifyUser } from "../middlewares/authMiddleware.js";
import {
  getUserProfile,
  getSuggestedUsers,
  updateUserProfile,
  followUnfollowUser,
} from "../controllers/userController.js";
const router = express.Router();

router.get("/profile/:useranme", verifyToken, getUserProfile);
router.get("/suggested", verifyToken, getSuggestedUsers);
router.put("/update/:id", verifyUser, updateUserProfile);
router.post("/follow/:id", verifyUser, followUnfollowUser);

export default router;
