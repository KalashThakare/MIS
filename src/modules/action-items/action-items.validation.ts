import { NextFunction, Request, Response } from "express";
import { z, ZodType } from "zod";
import { ValidationError } from "../../shared/errors/ValidationError";
import { ACTION_ITEM_STATUSES } from "./action-items.types";

const uuidMessage = "Must be a valid ID.";

const createActionItemSchema = z.object({
  meetingId: z.uuid(uuidMessage),
  title: z.string().trim().min(1, "Action item title is required.").max(200, "Must be 200 characters or fewer."),
  description: z.string().trim().optional(),
  assigneeId: z.uuid(uuidMessage),
  dueDate: z.iso.datetime("Due date must be a valid ISO datetime."),
});

const updateStatusSchema = z.object({
  status: z.enum(ACTION_ITEM_STATUSES, "Status must be PENDING, IN_PROGRESS, or COMPLETED."),
});

const listActionItemsSchema = z.object({
  status: z.enum(ACTION_ITEM_STATUSES, "Status must be PENDING, IN_PROGRESS, or COMPLETED.").optional(),
  assignee: z.uuid(uuidMessage).optional(),
  assigneeId: z.uuid(uuidMessage).optional(),
  meetingId: z.uuid(uuidMessage).optional(),
});

export const validateCreateActionItem = validateBody(createActionItemSchema);
export const validateUpdateActionItemStatus = validateBody(updateStatusSchema);
export const validateListActionItems = validateQuery(listActionItemsSchema);

function validateBody(schema: ZodType) {
  return (request: Request, _response: Response, next: NextFunction): void => {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      next(toValidationError(result.error.issues));
      return;
    }

    request.body = result.data;
    next();
  };
}

function validateQuery(schema: ZodType) {
  return (request: Request, _response: Response, next: NextFunction): void => {
    const result = schema.safeParse(request.query);

    if (!result.success) {
      next(toValidationError(result.error.issues));
      return;
    }

    request.query = result.data as Request["query"];
    next();
  };
}

function toValidationError(issues: z.core.$ZodIssue[]): ValidationError {
  return new ValidationError(issues.map((issue) => ({
    field: issue.path.join(".") || "body",
    message: issue.message,
  })));
}
