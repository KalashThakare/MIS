import { ErrorRequestHandler } from "express";
import { env } from "../../config/env";
import { AppError } from "../errors/AppError";
import { logger } from "../logger/pino";

export const errorHandler: ErrorRequestHandler = (error, request, response, _next) => {
  const appError = toAppError(error);

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
      ...(appError.details !== undefined && { details: appError.details }),
      ...(env.nodeEnv !== "production" && { stack: error instanceof Error ? error.stack : undefined })
    }
  });
};

function toAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (isMalformedJsonError(error)) {
    return new AppError("Malformed JSON request body.", 400);
  }

  return new AppError("Internal server error");
}

function isMalformedJsonError(error: unknown): error is SyntaxError & { status: number; type: string } {
  return error instanceof SyntaxError
    && "status" in error
    && "type" in error
    && error.status === 400
    && error.type === "entity.parse.failed";
}
