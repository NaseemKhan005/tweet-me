import { config } from "../config/config.js";

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const error = err.message || "Something went wrong";

  res.status(status).json({
    success: false,
    status,
    error,
    stack: config.env === "development" ? err.stack : "🥞",
  });
};

export default errorHandler;
