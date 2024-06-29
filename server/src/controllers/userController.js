import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

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
    const { userId } = req.user;
    const usersFollowedByMe = await User.findById(userId).select("following");
    const suggestedUsers = await User.find({
      _id: { $nin: [...usersFollowedByMe.following, userId] },
    }).select("username profilePic");

    res
      .status(200)
      .json({ message: "Suggested Users Fetched.", suggestedUsers });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const {
      username,
      fullName,
      email,
      bio,
      link,
      currentPassword,
      newPassword,
    } = req.body;
    let { profilePicture, coverPicture } = req.body;

    let user = await User.findById(req.user.userId).select("-password");
    if (!user) return next(createError(404, "User not found."));

    if ((currentPassword && !newPassword) || (!currentPassword && newPassword))
      return next(
        createError(400, "Please provide both current and new password.")
      );

    if (currentPassword && newPassword) {
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordValid)
        return next(createError(400, "Current password is incorrect."));

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (profilePicture) {
      if (user.profilePicture) {
        const publicId = user.profilePicture.match(/[^/]*$/)[0].split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      const uploadResult = await cloudinary.uploader
        .upload(profilePicture)
        .catch((error) => {
          next(createError(400, "Profile Picture upload failed."));
        });

      profilePicture = uploadResult.secure_url;
    }

    if (coverPicture) {
      if (user.coverPicture) {
        const publicId = user.coverPicture.match(/[^/]*$/)[0].split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      const uploadResult = await cloudinary.uploader
        .upload(coverPicture)
        .catch((error) => {
          next(createError(400, "Cover Image upload failed."));
        });

      coverPicture = uploadResult.secure_url;
    }

    if (username) {
      const isUsernameTaken = await User.findOne({ username });
      if (isUsernameTaken) return next(createError(400, "Username is taken."));

      user.username = username || user.username;
    }

    if (email) {
      const isEmailAlreadyRegistered = await User.findOne({ email });
      if (isEmailAlreadyRegistered)
        return next(createError(400, "Email is already registered."));

      user.email = email || user.email;
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.fullName = fullName || user.fullName;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profilePic = profilePicture || user.profilePic;
    user.coverPic = coverPicture || user.coverPic;

    user = await user.save();

    res.status(200).json({ message: "Profile Updated Successfully.", user });
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
