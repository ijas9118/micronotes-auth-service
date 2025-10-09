import winston from "winston";

import env from "./validate-env.js";

const logFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack ?? message}`;
});

const customColors = {
  error: "red",
  warn: "yellow",
  info: "cyan",
  http: "green",
  debug: "blue",
};

winston.addColors(customColors);

const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: "HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    logFormat,
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
