import bcrypt from "bcrypt";

import createError from "../helpers/createError.js";
import User from "../models/userModel.js";

export const register = async (req, res, next) => {
  try {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password)
      return next(createError(400, "Please fill in all fields."));

    if (password.length < 6)
      return next(createError(400, "Password must be at least 6 characters."));

    const userExists = await User.findOne({ email });
    if (userExists) return next(createError(400, "Email already registered."));

    const usernameExists = await User.findOne({ username });
    if (usernameExists)
      return next(createError(400, "Username already taken."));

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    const { password: userPassword, ...userInfo } = user._doc;

    res
      .status(201)
      .json({ message: "User registered successfully.", user: userInfo });
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
