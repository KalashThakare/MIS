import { RequestHandler } from "express";
import { AppError } from "../errors/AppError";

export const notFoundHandler: RequestHandler = (request, _response, next) => {
  next(new AppError(`Route ${request.method} ${request.originalUrl} not found.`, 404, true, undefined, "NOT_FOUND"));
};
