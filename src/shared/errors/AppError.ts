export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 500,
    public readonly isOperational = true,
    public readonly details?: unknown
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
