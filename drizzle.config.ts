import { defineConfig } from "drizzle-kit";

import env from "./src/configs/validate-env.ts";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL || "postgresql://micronotes:cantremember@localhost:5432/micronotes_auth",
  },
  verbose: true,
  strict: true,
});
