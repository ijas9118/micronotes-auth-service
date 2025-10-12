import type { JWTPayload } from "./index.ts";

declare global {
  namespace Express {
    // eslint-disable-next-line ts/consistent-type-definitions
    interface Request {
      user?: JWTPayload;
    }
  }
}
