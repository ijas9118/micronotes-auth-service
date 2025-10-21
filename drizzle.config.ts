/* eslint-disable node/no-process-env */
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://micronotes:cantremember@localhost:5432/micronotes_auth",
  },
  verbose: true,
  strict: true,
});
