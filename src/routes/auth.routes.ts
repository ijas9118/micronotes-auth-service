import { Router } from "express";

import type { IAuthController } from "@/controllers/auth.controller.interface.js";

import { container } from "@/ioc/container.js";
import TYPES from "@/ioc/types.js";

const authController = container.get<IAuthController>(TYPES.AuthController);

const router: Router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refresh);

export default router;
