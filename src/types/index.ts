export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type JWTPayload = {
  userId: string;
  email: string;
  iat: number;
  exp: number;
};

export type User = {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};
