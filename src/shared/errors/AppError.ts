export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 500,
    public readonly isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
