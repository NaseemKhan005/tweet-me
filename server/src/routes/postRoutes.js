import express from "express";
import {
  createNewPost,
  deletePost,
  getAllPosts,
  getSinglePost,
  likeUnlikePost,
  commentOnPost,
  getLikedPosts,
  getFollowingPosts,
  getAuthUserPosts
} from "../controllers/postController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/", verifyToken, getAllPosts);
router.get("/:id", verifyToken, getSinglePost);
router.get("/liked-posts/:id", verifyToken, getLikedPosts);
router.get("/following", verifyToken, getFollowingPosts);
router.get("/user/:username", verifyToken, getAuthUserPosts);
router.post("/", verifyToken, createNewPost);
router.post("/like/:id", verifyToken, likeUnlikePost);
router.post("/comment/:id", verifyToken, commentOnPost);
router.delete("/:id", verifyToken, deletePost);

export default router;
