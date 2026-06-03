export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 500,
    public readonly isOperational = true,
    public readonly details?: unknown,
    public readonly code = getDefaultErrorCode(statusCode)
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

function getDefaultErrorCode(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return "BAD_REQUEST";
    case 401:
      return "UNAUTHORIZED";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    case 409:
      return "CONFLICT";
    default:
      return statusCode >= 500 ? "INTERNAL_SERVER_ERROR" : "APP_ERROR";
  }
}
