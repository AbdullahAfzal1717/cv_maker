export class ApiError extends Error {
  statusCode: number;
  meta: Record<string, unknown> | null;

  constructor(
    message: string,
    statusCode = 500,
    meta: Record<string, unknown> | null = null,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.meta = meta;
    Error.captureStackTrace(this, this.constructor);
  }
}
