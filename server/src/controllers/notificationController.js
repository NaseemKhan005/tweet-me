import Notification from "../models/notificationModel.js";

export const getAllNotifications = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "profileImg username fullName",
    });

    await Notification.updateMany({ to: userId }, { read: true });

    if (notifications.length === 0) {
      return res
        .status(200)
        .json({ message: "No notifications found", notifications: [] });
    }

    res.status(200).json({
      message: "All notifications fetched successfully!",
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAllNotifications = async (req, res, next) => {
  try {
    const { userId } = req.user;

    await Notification.deleteMany({ to: userId });

    res.status(200).json({ message: "All notifications deleted successfully" });
  } catch (error) {
    next(error);
  }
};
