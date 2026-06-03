import pino, { Logger as PinoInstance } from "pino";
import { env } from "../../config/env";
import { Logger } from "./Logger";

export class PinoLogger implements Logger {
  private readonly logger: PinoInstance;

  constructor() {
    this.logger = pino({
      level: process.env.LOG_LEVEL ?? "info",
      base: {
        environment: env.nodeEnv,
        service: "mis-api"
      },
      timestamp: pino.stdTimeFunctions.isoTime
    });
  }

  error(message: string, meta?: unknown): void {
    this.logger.error(this.toLogObject(meta), message);
  }

  info(message: string, meta?: unknown): void {
    this.logger.info(this.toLogObject(meta), message);
  }

  warn(message: string, meta?: unknown): void {
    this.logger.warn(this.toLogObject(meta), message);
  }

  private toLogObject(meta?: unknown): Record<string, unknown> {
    if (meta instanceof Error) {
      return {
        error: {
          message: meta.message,
          name: meta.name,
          stack: meta.stack
        }
      };
    }

    if (meta && typeof meta === "object" && !Array.isArray(meta)) {
      return meta as Record<string, unknown>;
    }

    return meta === undefined ? {} : { meta };
  }
}
