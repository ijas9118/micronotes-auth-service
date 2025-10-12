import { Router } from "express";

import type { IAuthController } from "@/controllers/auth.controller.interface.js";

import { container } from "@/ioc/container.js";
import TYPES from "@/ioc/types.js";
import { authMiddleware } from "@/middleware/auth.middleware.js";

const authController = container.get<IAuthController>(TYPES.AuthController);

const router: Router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authMiddleware, authController.logout);
router.post("/refresh", authMiddleware, authController.refresh);

export default router;
