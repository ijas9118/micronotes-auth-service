import type { NextFunction, Request, Response } from "express";

export type IAuthController = {
  register: (req: Request, res: Response, next: NextFunction) => void;
  login: (req: Request, res: Response, next: NextFunction) => void;
  logout: (req: Request, res: Response, next: NextFunction) => void;
  refresh: (req: Request, res: Response, next: NextFunction) => void;
  verifyOTP: (req: Request, res: Response, next: NextFunction) => void;
};
