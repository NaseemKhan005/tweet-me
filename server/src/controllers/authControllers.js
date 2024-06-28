export const register = async (req, res, next) => {
  try {
    res.status(200).json("Register route");
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    res.status(200).json("Login route");
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.status(200).json("Logout route");
  } catch (error) {
    next(error);
  }
};
