import type { SignOptions } from "jsonwebtoken";

import jwt from "jsonwebtoken";

import type { JWTPayload } from "@/types/index.js";

import env from "@/configs/validate-env.js";

export function signToken(payload: object, expiresIn?: string | number): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: expiresIn ?? env.JWT_EXPIRES_IN,
  } as SignOptions);
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, env.JWT_SECRET) as JWTPayload;
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === "string")
      return true;

    const exp = decoded.exp;
    if (!exp)
      return false;

    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime >= exp;
  }
  catch {
    return true;
  }
}
