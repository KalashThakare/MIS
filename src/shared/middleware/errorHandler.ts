import { ErrorRequestHandler } from "express";
import { env } from "../../config/env";
import { AppError } from "../errors/AppError";
import { logger } from "../logger/pino";

export const errorHandler: ErrorRequestHandler = (error, request, response, _next) => {
  const appError = error instanceof AppError ? error : new AppError("Internal server error");

  logger.error({
    traceId: request.traceId,
    method: request.method,
    path: request.originalUrl,
    statusCode: appError.statusCode,
    error: {
      message: error instanceof Error ? error.message : "Unknown error",
      name: error instanceof Error ? error.name : "UnknownError",
      stack: error instanceof Error ? error.stack : undefined,
      isOperational: appError.isOperational
    }
  }, "HTTP request failed.");

  response.status(appError.statusCode).json({
    error: {
      message: appError.message,
      ...(env.nodeEnv !== "production" && { stack: error instanceof Error ? error.stack : undefined })
    }
  });
};
