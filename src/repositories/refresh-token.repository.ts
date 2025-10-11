import { and, eq } from "drizzle-orm";
import { injectable } from "inversify";

import type { RefreshToken } from "@/db/schema.js";

import { db } from "@/db/index.js";
import { refreshTokens } from "@/db/schema.js";

import type { IRefreshTokenRepository } from "./interfaces/refresh-token.repository.interface.js";

@injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  async createToken(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<RefreshToken | undefined> {
    const [inserted] = await db
      .insert(refreshTokens)
      .values({ userId, token, expiresAt })
      .returning();

    return inserted;
  }

  async findRefreshToken(refreshToken: string, userId: string): Promise<RefreshToken | null> {
    const result = await db.query.refreshTokens.findFirst({
      where: and(
        eq(refreshTokens.token, refreshToken),
        eq(refreshTokens.userId, userId),
      ),
    });
    return result ?? null;
  }

  async markTokenAsUsed(token: string): Promise<void> {
    await db
      .update(refreshTokens)
      .set({ used: true })
      .where(eq(refreshTokens.token, token));
  }

  async deleteAllTokens(userId: string): Promise<void> {
    await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
  }
}
