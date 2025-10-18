import rateLimit from "express-rate-limit";

import env from "@/configs/validate-env.js";

export const limiter = rateLimit({
  skip: (_req, _res) => {
    return env.NODE_ENV === "production";
  },
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      status: 429,
      message: "Too many requests. Please try again later.",
      timestamp: new Date().toISOString(),
    });
  },
});
