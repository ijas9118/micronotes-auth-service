import type { NextFunction, Request, Response } from "express";

import env from "@/configs/validate-env.js";

export default function errorHandler(
  error: Error & { statusCode?: number },
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const statusCode = error.statusCode ?? 500;
  const isProd = env.NODE_ENV === "production";

  res.status(statusCode).json({ messaage: isProd ? "Something went wrong!!" : error.message });
}
