import "reflect-metadata";
import type { Application, NextFunction, Request, Response } from "express";

import cors from "cors";
import express from "express";
import helmet from "helmet";
import client from "prom-client";

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

const register = new client.Registry();
client.collectDefaultMetrics({ register });

export const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code", "service"],
});
register.registerMetric(httpRequestCounter);

app.use((req: Request, res: Response, next: NextFunction) => {
  const routePath = req.route ? req.route.path : req.path;

  res.on("finish", () => {
    httpRequestCounter.inc({
      method: req.method,
      route: routePath,
      status_code: res.statusCode,
      service: "auth-service",
    });
  });

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

app.get("/metrics", async (_req: Request, res: Response) => {
  try {
    res.setHeader("Content-Type", register.contentType);
    res.end(await register.metrics());
  }
  catch (err) {
    res.status(500).end(err);
  }
});

app.use((req: Request, res: Response) => {
  logger.warn(`Resource not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: "resource not found" });
});

app.use(errorHandler);

export default app;
