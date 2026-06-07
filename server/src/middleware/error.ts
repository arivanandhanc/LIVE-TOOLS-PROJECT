import type { Request, Response, NextFunction, RequestHandler } from "express";
import { logger } from "../config/logger";

export class HttpError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message);
  }
}

/** Wrap async handlers so rejected promises reach the error middleware. */
export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: "Not found" });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const status =
    err instanceof HttpError ? err.status : typeof (err as { status?: number })?.status === "number" ? (err as { status: number }).status : 500;
  const message = err instanceof Error ? err.message : "Internal server error";

  if (status >= 500) {
    logger.error({ err, path: req.path }, "Unhandled error");
  }
  res.status(status).json({
    error: status >= 500 ? "Internal server error" : message,
    ...(err instanceof HttpError && err.details ? { details: err.details } : {}),
  });
}
