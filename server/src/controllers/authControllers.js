export const register = async (req, res) => {
  try {
    res.status(200).json("Register route");
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    res.status(200).json("Login route");
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    res.status(200).json("Logout route");
  } catch (error) {
    console.log(error);
  }
};
