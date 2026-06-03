import { AppError } from "./AppError";

export interface ValidationIssue {
  field: string;
  message: string;
}

export class ValidationError extends AppError {
  constructor(issues: ValidationIssue[]) {
    super("Validation failed.", 400, true, issues);
  }
}
