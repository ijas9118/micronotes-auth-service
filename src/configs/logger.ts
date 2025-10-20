import winston from "winston";
import LokiTransport from "winston-loki";

import env from "./validate-env.js";

const logFormat = winston.format.printf(({ level, message, timestamp, stack, service }) => {
  return `${timestamp} [${service || "unknown"}] [${level}]: ${stack ?? message}`;
});

const logger = winston.createLogger({
  level: env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    logFormat,
  ),
  defaultMeta: { service: env.SERVICE_NAME || "unknown-service" },
  transports: [
    new winston.transports.Console(),
    new LokiTransport({
      host: "http://loki:3100",
      labels: { service: env.SERVICE_NAME || "unknown-service" },
      json: true,
      replaceTimestamp: true,
      batching: true,
      interval: 5,
    }),
  ],
});

export default logger;
