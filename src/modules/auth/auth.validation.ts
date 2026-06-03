import { NextFunction, Request, Response } from "express";
import { z, ZodType } from "zod";
import { ValidationError } from "../../shared/errors/ValidationError";

const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email("Must be a valid email address."),
  name: z.string().trim().min(1, "Is required."),
  password: z.string().min(5, "Must be at least 5 characters long.")
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Must be a valid email address."),
  password: z.string().trim().min(1, "Is required.")
});

export const validateRegister = validateBody(registerSchema);
export const validateLogin = validateBody(loginSchema);

function validateBody(schema: ZodType) {
  return (request: Request, _response: Response, next: NextFunction): void => {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      next(new ValidationError(result.error.issues.map((issue) => ({
        field: issue.path.join(".") || "body",
        message: issue.message
      }))));
      return;
    }

    request.body = result.data;
    next();
  };
}
