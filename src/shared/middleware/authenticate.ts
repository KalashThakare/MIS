import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { AppError } from "../errors/AppError";

interface TokenPayload {
  sub: string;
  email: string;
}

export function authenticate(request: Request, _response: Response, next: NextFunction): void {
  const authorization = request.header("authorization");
  const [scheme, token] = authorization?.split(" ") ?? [];

  if (scheme !== "Bearer" || !token) {
    next(new AppError("Missing or invalid authorization header.", 401));
    return;
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as TokenPayload;

    request.user = {
      id: payload.sub,
      email: payload.email
    };

    next();
  } catch {
    next(new AppError("Invalid or expired token.", 401));
  }
}
