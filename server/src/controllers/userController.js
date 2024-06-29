import User from "../models/userModel.js";
import Notification from "../models/notificationModel.js";
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
    const currentUser = await User.findById(req.user.userId);
    const userToFollow = await User.findById(req.params.id);

    if (!currentUser || !userToFollow)
      return next(createError(404, "User not found."));

    if (req.params.id === req.user.userId)
      return next(createError(400, "You can't follow yourself."));

    const isFollowing = currentUser.following.includes(userToFollow._id);

    if (isFollowing) {
      // Unfollow the user
      userToFollow.followers.pull(currentUser._id);
      currentUser.following.pull(userToFollow._id);

      const notification = await Notification.create({
        from: currentUser._id,
        to: userToFollow._id,
        type: "follow",
        read: false,
        content: `${currentUser.username} unfollowed you.`,
      });

      res.status(200).json({ notification });
    } else {
      // Follow the user
      userToFollow.followers.push(currentUser._id);
      currentUser.following.push(userToFollow._id);

      const notification = await Notification.create({
        from: currentUser._id,
        to: userToFollow._id,
        type: "follow",
        read: false,
        content: `${currentUser.username} followed you.`,
      });

      res.status(200).json({ notification });
    }
    await currentUser.save();
    await userToFollow.save();
  } catch (error) {
    next(error);
  }
};
