import { v2 as cloudinary } from "cloudinary";

import Post from "../models/postModel.js";
import createError from "../helpers/createError.js";

export const createNewPost = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    let { image } = req.body;

    if (!title) return next(createError(400, "Title is required"));
    if (!description) return next(createError(400, "Description is required"));
    if (!image) return next(createError(400, "Image is required"));

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
      title,
      description,
      image,
    });

    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    res.status(200).json({ message: "All posts fetched successfully" });
  } catch (error) {
    next(error);
  }
};

export const likeUnlikePost = async (req, res, next) => {
  try {
    res.status(200).json({ message: "Post liked/unliked successfully" });
  } catch (error) {
    next(error);
  }
};

export const commentOnPost = async (req, res, next) => {
  try {
    res.status(200).json({ message: "Comment added successfully" });
  } catch (error) {
    next(error);
  }
};
