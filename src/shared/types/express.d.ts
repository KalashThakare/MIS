declare global {
  namespace Express {
    interface Request {
      traceId?: string;
      user?: {
        id: string;
        email: string;
      };
    }

    interface Response {
      success(data?: unknown, statusCode?: number): void;
    }
  }
}

export {};
