import { RequestHandler } from "express";
import { randomUUID } from "node:crypto";
import { logger } from "../logger/pino";

export const requestLogger: RequestHandler = (request, response, next) => {
  const traceId = request.header("x-trace-id") ?? request.header("x-request-id") ?? randomUUID();
  const startedAt = process.hrtime.bigint();

  request.traceId = traceId;
  response.setHeader("x-trace-id", traceId);

  response.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;

    logger.info({
      traceId,
      method: request.method,
      path: request.originalUrl,
      statusCode: response.statusCode,
      durationMs: Math.round(durationMs),
      ip: request.ip
    }, "HTTP request completed.");
  });

  logger.info({
    traceId,
    method: request.method,
    path: request.originalUrl,
    ip: request.ip
  }, "HTTP request received.");

  next();
};
