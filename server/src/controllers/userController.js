import User from "../models/userModel.js";
import createError from "../helpers/createError.js";

export const getUserProfile = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select("-password");
    if (!user) return next(createError(404, "User not found."));

    res
      .status(200)
      .json({ message: "User Profile Fetched Successfully.", user });
  } catch (error) {
    next(error);
  }
};

export const getSuggestedUsers = async (req, res, next) => {
  try {
    res.status(200).json({ message: "Get suggested users." });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    res.status(200).json({ message: "Update user profile." });
  } catch (error) {
    next(error);
  }
};

export const followUnfollowUser = async (req, res, next) => {
  try {
    res.status(200).json({ message: "Follow or unfollow user." });
  } catch (error) {
    next(error);
  }
};
