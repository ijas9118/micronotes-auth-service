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

  verifyOTP = async (req: Request, res: Response) => {
    const { otp, email } = req.body;
    await this._authService.verifyOTP(otp, email);
    res.status(StatusCodes.OK).json({ message: "OTP verified" });
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const tokens = await this._authService.login(email, password);

    // setRefreshTokenCookie(res, tokens.refreshToken);

    res.status(StatusCodes.OK).json({ message: "User logged in", tokens });
  };

  logout = async (req: Request, res: Response) => {
    await this._authService.logout(`${req.user?.userId}`);
    res.status(StatusCodes.OK).json({ message: "User logged out" });
  };

  refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    const tokens = await this._authService.refresh(refreshToken);
    res.status(StatusCodes.OK).json({ message: "New tokens generated", tokens });
  };
}
