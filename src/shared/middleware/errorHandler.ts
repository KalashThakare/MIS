import { ErrorRequestHandler } from "express";
import { env } from "../../config/env";
import { AppError } from "../errors/AppError";
import { PinoLogger } from "../logger/PinoLogger";

const logger = new PinoLogger();

export const errorHandler: ErrorRequestHandler = (error, request, response, _next) => {
  const appError = error instanceof AppError ? error : new AppError("Internal server error");

  logger.error("HTTP request failed.", {
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
  });

  response.status(appError.statusCode).json({
    error: {
      message: appError.message,
      ...(env.nodeEnv !== "production" && { stack: error instanceof Error ? error.stack : undefined })
    }
  });
};
