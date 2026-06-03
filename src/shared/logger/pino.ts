import pino from "pino";
import { env } from "../../config/env";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  base: {
    environment: env.nodeEnv,
    service: "mis-api"
  },
  timestamp: pino.stdTimeFunctions.isoTime
});
