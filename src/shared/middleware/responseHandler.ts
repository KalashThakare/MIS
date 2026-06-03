import { RequestHandler } from "express";

export const responseHandler: RequestHandler = (request, response, next) => {
  response.success = (data: unknown = {}, statusCode = 200): void => {
    response.status(statusCode).json({
      traceId: request.traceId,
      success: true,
      data
    });
  };

  next();
};
