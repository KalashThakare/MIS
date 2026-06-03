import { NextFunction, Request, Response } from "express";
import { z, ZodType } from "zod";
import { ValidationError } from "../../shared/errors/ValidationError";

const uuidMessage = "Must be a valid ID.";

const transcriptEntrySchema = z.object({
  timestamp: z.string().trim().min(1, { message: "Transcript timestamp is required." }),
  speaker: z.string().trim().min(1, { message: "Transcript speaker is required." }),
  text: z.string().trim().min(1, { message: "Transcript text is required." }),
});

const createMeetingSchema = z.object({
  title: z.string().trim()
    .min(1, { message: "Meeting title is required." })
    .max(200, { message: "Must be 200 characters or fewer." }),
  participants: z.array(
    z.string().trim().toLowerCase().pipe(z.email({ message: "Participant must be a valid email address." }))
  ).min(1, { message: "At least one participant is required." }),
  meetingDate: z.iso.datetime({ message: "Meeting date must be a valid ISO datetime." }),
  transcript: z.array(transcriptEntrySchema).min(1, { message: "Meeting transcript is required." }),
});

const meetingIdParamsSchema = z.object({
  id: z.uuid({ message: uuidMessage }),
});

const listMeetingsSchema = z.object({
  page: z.coerce.number()
    .int({ message: "Page must be a positive integer." })
    .positive({ message: "Page must be a positive integer." })
    .optional(),
  limit: z.coerce.number()
    .int({ message: "Limit must be a positive integer." })
    .positive({ message: "Limit must be a positive integer." })
    .optional(),
});

export const validateCreateMeeting = validateBody(createMeetingSchema);
export const validateMeetingIdParams = validateParams(meetingIdParamsSchema);
export const validateListMeetings = validateQuery(listMeetingsSchema);

function validateBody(schema: ZodType) {
  return (request: Request, _response: Response, next: NextFunction): void => {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      next(toValidationError(result.error.issues, "body"));
      return;
    }

    request.body = result.data;
    next();
  };
}

function validateParams(schema: ZodType) {
  return (request: Request, _response: Response, next: NextFunction): void => {
    const result = schema.safeParse(request.params);

    if (!result.success) {
      next(toValidationError(result.error.issues, "params"));
      return;
    }

    request.params = result.data as Request["params"];
    next();
  };
}

function validateQuery(schema: ZodType) {
  return (request: Request, _response: Response, next: NextFunction): void => {
    const result = schema.safeParse(request.query);

    if (!result.success) {
      next(toValidationError(result.error.issues, "query"));
      return;
    }

    request.query = result.data as Request["query"];
    next();
  };
}

function toValidationError(issues: z.core.$ZodIssue[], source: string): ValidationError {
  return new ValidationError(issues.map((issue) => ({
    field: issue.path.join(".") || source,
    message: issue.message,
  })));
}
