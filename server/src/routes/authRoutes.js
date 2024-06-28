import express from "express";
import {
  login,
  logout,
  register,
  getMe,
} from "../controllers/authControllers.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verifyToken, getMe);

export default router;
