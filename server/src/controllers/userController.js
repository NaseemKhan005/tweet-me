export const getUserProfile = async (req, res, next) => {
  try {
    res.status(200).json({ message: "Get user profile." });
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
