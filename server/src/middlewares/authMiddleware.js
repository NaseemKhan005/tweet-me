import jwt from "jsonwebtoken";

import createError from "../helpers/createError.js";
import { config } from "../config/config.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return next(createError(401, "Unauthorized."));

    jwt.verify(token, config.jwtSecret, (err, user) => {
      if (err) return next(createError(403, "Invalid or expired token."));

      req.user = user;
      next();
    });
  } catch (error) {
    next(error);
  }
};
