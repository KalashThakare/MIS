import { RequestHandler } from "express";
import { randomUUID } from "node:crypto";
import { PinoLogger } from "../logger/PinoLogger";

const logger = new PinoLogger();

export const requestLogger: RequestHandler = (request, response, next) => {
  const traceId = request.header("x-trace-id") ?? request.header("x-request-id") ?? randomUUID();
  const startedAt = process.hrtime.bigint();

  request.traceId = traceId;
  response.setHeader("x-trace-id", traceId);

  response.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;

    logger.info("HTTP request completed.", {
      traceId,
      method: request.method,
      path: request.originalUrl,
      statusCode: response.statusCode,
      durationMs: Math.round(durationMs),
      ip: request.ip
    });
  });

  logger.info("HTTP request received.", {
    traceId,
    method: request.method,
    path: request.originalUrl,
    ip: request.ip
  });

  next();
};
