import { migrate } from "drizzle-orm/node-postgres/migrator";

import app from "./app.js";
import logger from "./configs/logger.js";
import { initRedisClient } from "./configs/redis.config.js";
import env from "./configs/validate-env.js";
import { db } from "./db/index.js";

const PORT = env.PORT || 3001;

initRedisClient();

async function startServer() {
  try {
    initRedisClient();

    logger.info("Running database migrations...");
    await migrate(db, { migrationsFolder: "./migrations" });
    logger.info("Database migrations applied successfully.");

    app.listen(PORT, () => {
      logger.info(`Auth service is running on port ${PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
    });
  }
  catch (error) {
    logger.error("Failed to start server or apply migrations:", error);
    process.exit(1);
  }
}

startServer();
