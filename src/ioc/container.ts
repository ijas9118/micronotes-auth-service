import { Container } from "inversify";

import type { IAuthController } from "@/controllers/auth.controller.interface.js";
import type { IRefreshTokenRepository } from "@/repositories/interfaces/refresh-token.repository.interface.js";
import type { IUserRepository } from "@/repositories/interfaces/user.repository.interface.js";
import type { IAuthService } from "@/services/auth.service.interface.js";

import { AuthController } from "@/controllers/auth.controller.js";
import { RefreshTokenRepository } from "@/repositories/refresh-token.repository.js";
import { UserRepository } from "@/repositories/user.repository.js";
import { AuthService } from "@/services/auth.service.js";

import TYPES from "./types.js";

const container = new Container();

container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IRefreshTokenRepository>(TYPES.RefreshTokenRepository).to(RefreshTokenRepository);

container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<IAuthController>(TYPES.AuthController).to(AuthController);

export { container };
