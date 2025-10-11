import type { AuthTokens } from "@/types/index.js";

export type IAuthService = {
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<AuthTokens>;
  logout: (userId: string) => Promise<void>;
  refresh: (refreshToken: string) => Promise<AuthTokens>;
  // deleteUser: (userId: string) => Promise<void>;
};
