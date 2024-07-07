import { v2 as cloudinary } from "cloudinary";

import Post from "../models/postModel.js";
import Notification from "../models/notificationModel.js";
import createError from "../helpers/createError.js";
import User from "../models/userModel.js";

export const createNewPost = async (req, res, next) => {
  try {
    const { text } = req.body;
    let { image } = req.body;

    if (!text) return next(createError(400, "Text is required"));

    if (image) {
      const uploadResult = await cloudinary.uploader
        .upload(image)
        .catch((error) => {
          next(createError(400, "Image upload failed."));
        });

      image = uploadResult.secure_url;
    }

    const post = await Post.create({
      user: req.user.userId,
      text,
      image,
    });

    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) return next(createError(404, "Post not found"));
    if (post.user.toString() !== userId) {
      return next(
        createError(403, "You are not authorized to delete this post")
      );
    }

    await Post.findByIdAndDelete(id);
    // deleting image from cloudinary
    if (post.image) {
      const publicId = post.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "username profilePicture fullName")
      .populate(
        "comments.user",
        "username profilePicture fullName createdAt updatedAt"
      );

    if (posts.length === 0) {
      return res.status(200).json({ message: "No posts found", posts: [] });
    }

    res.status(200).json({ message: "All posts fetched successfully", posts });
  } catch (error) {
    next(error);
  }
};

export const getSinglePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id).populate({
      path: "user",
      select: "-password",
    });
    if (!post) return next(createError(404, "Post not found"));

    res.status(200).json({ message: "Post fetched successfully", post });
  } catch (error) {
    next(error);
  }
};

export const getFollowingPosts = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return next(createError(404, "User not found"));

    const followingPosts = await Post.find({
      user: { $in: user.following },
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (followingPosts.length === 0) {
      return res
        .status(200)
        .json({ message: "No posts found from the users you follow." });
    }

    res.status(200).json({
      message: "Following posts fetched successfully",
      posts: followingPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const getAuthUserPosts = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) return next(createError(404, "User not found!"));

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (posts?.length === 0)
      return res
        .status(200)
        .json({ message: "You didn't created any posts yet!" });

    res.status(200).json({
      message: "Authenticated User Posts Fetched Successfully!",
      posts,
    });
  } catch (error) {
    next(error);
  }
};

export const getLikedPosts = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return next(createError(404, "User not found"));

    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (likedPosts.length === 0) {
      return res
        .status(200)
        .json({ message: "You don't have liked any post.", likedPosts: [] });
    }

    res.status(200).json({
      message: "Liked posts fetched successfully",
      posts: likedPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const likeUnlikePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const post = await Post.findById(id).populate({
      path: "user",
      select: "-password",
    });
    if (!post) return next(createError(404, "Post not found"));

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes.pull(userId);
      await post.save();

      await User.findByIdAndUpdate(userId, {
        $pull: { likedPosts: id },
      });

      const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());

      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
        content: `${post.user.username} unliked your post.`,
      });

      await notification.save();
      res.status(200).json({
        message: "Post unliked successfully",
        notification,
        updatedLikes,
      });
    } else {
      post.likes.push(userId);
      await post.save();

      await User.findByIdAndUpdate(userId, {
        $push: { likedPosts: id },
      });

      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
        content: `${post.user.username} liked your post.`,
      });

      await notification.save();
      res.status(200).json({
        message: "Post liked successfully",
        notification,
        updatedLikes: post.likes,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const commentOnPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const post = await Post.findById(id);
    if (!post) return next(createError(404, "Post not found"));

    if (!text) return next(createError(400, "Comment text is required"));
    post.comments.push({ user: req.user.userId, text });
    await post.save();

    res.status(200).json({ message: "Comment added successfully" });
  } catch (error) {
    next(error);
  }
};
