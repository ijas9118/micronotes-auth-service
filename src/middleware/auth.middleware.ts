import type { NextFunction, Request, Response } from "express";

import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import { HttpError } from "@/utils/http-error-class.js";
import { verifyToken } from "@/utils/jwt-helpers.js";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw new HttpError("Missing or invalid authorization header", StatusCodes.UNAUTHORIZED);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new HttpError("Access token missing", StatusCodes.UNAUTHORIZED);
    }

    const decoded = verifyToken(token);
    req.user = decoded;

    next();
  }
  catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new HttpError("Access token expired", StatusCodes.UNAUTHORIZED));
    }
    else if (error instanceof jwt.JsonWebTokenError) {
      next(new HttpError("Invalid access token", StatusCodes.UNAUTHORIZED));
    }
    else {
      next(error);
    }
  }
}
