import type { Request, Response } from "express";

import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IAuthService } from "@/services/auth.service.interface.js";

import TYPES from "@/ioc/types.js";

import type { IAuthController } from "./auth.controller.interface.js";

@injectable()
export class AuthController implements IAuthController {
  constructor(@inject(TYPES.AuthService) private _authService: IAuthService) {}

  register = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    await this._authService.register(email, password);

    res.status(StatusCodes.OK).json({ message: `OTP sent to ${email}` });
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const tokens = await this._authService.login(email, password);

    // setRefreshTokenCookie(res, tokens.refreshToken);

    res.status(StatusCodes.OK).json({ message: "User logged in", tokens });
  };

  logout = async (req: Request, res: Response) => {
    const { userId } = req.body;

    await this._authService.logout(userId);
    res.status(StatusCodes.OK).json({ message: "User logged out" });
  };

  refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    const tokens = await this._authService.refresh(refreshToken);
    res.status(StatusCodes.OK).json({ message: "New tokens generated", tokens });
  };

  // refreshTokens = asyncHandler(async (req: Request, res: Response) => {
  //   // const { refreshToken } = req.cookies;
  //   const { refreshToken } = req.body;

  //   const tokens = await this.authService.refreshTokens(refreshToken);

  //   res.status(STATUS_CODES.OK).json(createSuccessResponse(tokens, MESSAGES.AUTH.TOKENS_REFRESHED));
  // });

  // logout = asyncHandler(async (req: Request, res: Response) => {
  //   // const { refreshToken } = req.cookies;
  //   const { refreshToken } = req.body;

  //   // clearRefreshTokenCookie(res);
  //   await this.authService.logout(refreshToken);

  //   res.status(STATUS_CODES.OK).json(createSuccessResponse(null, MESSAGES.AUTH.USER_LOGGED_OUT));
  // });

  // validateToken = asyncHandler(async (req: Request, res: Response) => {
  //   const authHeader = req.headers.authorization;
  //   const token = authHeader?.split(" ")[1];

  //   if (!token) {
  //     res.status(STATUS_CODES.UNAUTHORIZED).json(createErrorResponse(MESSAGES.AUTH.UNAUTHORIZED));
  //     return;
  //   }

  //   const payload = await this.authService.validateToken(token);

  //   res.status(STATUS_CODES.OK).json(createSuccessResponse(payload, MESSAGES.AUTH.TOKEN_VALID));
  // });

  // getProfile = asyncHandler(async (req: Request, res: Response) => {
  //   const userId = req.user?.userId;

  //   if (!userId) {
  //     res.status(STATUS_CODES.UNAUTHORIZED).json(createErrorResponse(MESSAGES.AUTH.UNAUTHORIZED));
  //     return;
  //   }

  //   const user = await this.authService.getUserById(userId);

  //   if (!user) {
  //     res.status(STATUS_CODES.NOT_FOUND).json(createErrorResponse(MESSAGES.USER.USER_NOT_FOUND));
  //     return;
  //   }

  //   res.status(STATUS_CODES.OK).json(createSuccessResponse(user, MESSAGES.USER.PROFILE_RETRIEVED));
  // });

  // deleteAccount = asyncHandler(async (req: Request, res: Response) => {
  //   const userId = req.user?.userId;

  //   if (!userId) {
  //     res.status(STATUS_CODES.UNAUTHORIZED).json(createErrorResponse(MESSAGES.AUTH.UNAUTHORIZED));
  //     return;
  //   }

  //   await this.authService.deleteUser(userId);

  //   res.status(STATUS_CODES.OK).json(createSuccessResponse(null, MESSAGES.USER.ACCOUNT_DELETED));
  // });
}
