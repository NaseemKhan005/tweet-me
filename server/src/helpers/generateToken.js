import jwt from "jsonwebtoken";

import { config } from "../config/config.js";

const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000,
    secure: config.env !== "development",
    sameSite: "strict",
  });
};

export default generateToken;
