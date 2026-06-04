import { Request, Response } from "express";
import rateLimit from "express-rate-limit";

const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;
const ONE_HOUR_IN_MS = 60 * 60 * 1000;

const buildRateLimitResponse = (request: Request, response: Response) => {
  response.status(429).json({
    traceId: request.traceId,
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests. Please try again later.",
    },
  });
};

export const globalRateLimiter = rateLimit({
  windowMs: ONE_HOUR_IN_MS,
  limit: 1000,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: buildRateLimitResponse,
});

export const apiRateLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES_IN_MS,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: buildRateLimitResponse,
});
