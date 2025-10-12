import app from "./app.js";
import logger from "./configs/logger.js";
import { initRedisClient } from "./configs/redis.config.js";
import env from "./configs/validate-env.js";

const PORT = env.PORT || 3001;

initRedisClient();

app.listen(PORT, () => {
  logger.info(`Auth service is running on port ${PORT}`);
  logger.info(`Environment: ${env.NODE_ENV}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
});
