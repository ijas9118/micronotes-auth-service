import type { SignOptions } from "jsonwebtoken";

import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";
import jwt from "jsonwebtoken";

import type { IRefreshTokenRepository } from "@/repositories/interfaces/refresh-token.repository.interface.js";
import type { IUserRepository } from "@/repositories/interfaces/user.repository.interface.js";
import type { AuthTokens, JWTPayload } from "@/types/index.js";

import env from "@/configs/validate-env.js";
import TYPES from "@/ioc/types.js";
import { HttpError } from "@/utils/http-error-class.js";
import { isTokenExpired } from "@/utils/jwt-helpers.js";

import type { IAuthService } from "./auth.service.interface.js";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.RefreshTokenRepository) private _refreshTokenRepo: IRefreshTokenRepository,
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository,
  ) {}

  private async _generateTokens(userId: string, email: string): Promise<AuthTokens> {
    const payload = { userId, email };

    const accessToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    } as SignOptions);

    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    } as SignOptions);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this._refreshTokenRepo.createToken(userId, refreshToken, expiresAt);

    return { accessToken, refreshToken };
  }

  async register(email: string, password: string): Promise<void> {
    const userExisting = await this._userRepo.findByEmail(email);

    if (userExisting) {
      throw new HttpError("User already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this._userRepo.createUser(email, hashedPassword);
  }

  async login(email: string, password: string): Promise<AuthTokens> {
    const user = await this._userRepo.findByEmail(email);
    if (!user) {
      throw new HttpError("Invalid email or password", StatusCodes.UNAUTHORIZED);
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new HttpError("Invalid email or password", StatusCodes.UNAUTHORIZED);
    }

    return this._generateTokens(user.id, user.email);
  }

  async logout(userId: string): Promise<void> {
    await this._refreshTokenRepo.deleteAllTokens(userId);
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as JWTPayload;

    const storedToken = await this._refreshTokenRepo.findRefreshToken(refreshToken, decoded.userId);
    if (storedToken) {
      if (!isTokenExpired(refreshToken) || storedToken.used) {
        await this._refreshTokenRepo.deleteAllTokens(decoded.userId);
        throw new HttpError("Invalid or reused refresh token, please re-authenticate", 401);
      }

      await this._refreshTokenRepo.markTokenAsUsed(refreshToken);

      return this._generateTokens(decoded.userId, decoded.email);
    }
    else {
      throw new HttpError("Invalid or expired token", StatusCodes.UNAUTHORIZED);
    }
  }
}
