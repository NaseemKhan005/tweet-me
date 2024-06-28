import { config } from "../config/config.js";

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  res.status(status).json({
    success: false,
    status,
    message,
    stack: config.env === "development" ? err.stack : "🥞",
  });
};

export default errorHandler;
