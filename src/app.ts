import "reflect-metadata";
import type { Application } from "express";

import cors from "cors";
import express from "express";
import helmet from "helmet";

import errorHandler from "./middleware/error-handler.js";
import authRoutes from "./routes/auth.routes.js";

const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) =>
  res.json({
    status: "ok",
    message: "Auth service is healthy",
    timestamp: new Date().toISOString(),
  }));

app.use("/api/v1/auth", authRoutes);

app.use(errorHandler);

export default app;
