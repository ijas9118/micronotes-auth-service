import "reflect-metadata";
import type { Application, NextFunction, Request, Response } from "express";

import cors from "cors";
import express from "express";
import helmet from "helmet";

import logger from "./configs/logger.js";
import errorHandler from "./middleware/error-handler.js";
import { limiter } from "./middleware/rate-limit.middleware.js";
import authRoutes from "./routes/auth.routes.js";

const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(limiter);

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.debug(`${req.method} ${req.url}`);
  next();
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Auth service is healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1/auth", authRoutes);

app.use((req: Request, res: Response) => {
  logger.warn(`Resource not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: "resource not found" });
});

app.use(errorHandler);

export default app;
