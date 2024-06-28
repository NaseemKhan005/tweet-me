import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => {
  res.send("<h1>Server is running...</h1>");
});
app.use("/api/v1/auth", authRoutes);

// Error handler
app.use(errorHandler);

export default app;
