import type { RefreshToken } from "@/db/schema.js";

export type IRefreshTokenRepository = {
  createToken: (userId: string, token: string, expiresAt: Date) => Promise<RefreshToken | undefined>;
  findRefreshToken: (refreshToken: string, userId: string) => Promise<RefreshToken | null>;
  markTokenAsUsed: (token: string) => Promise<void>;
  deleteAllTokens: (userId: string) => Promise<void>;
};
