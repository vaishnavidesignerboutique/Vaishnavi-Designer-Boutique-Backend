import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ error: "Not found" });
}

// 4-arg form so Express recognises it as an error handler.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation failed",
      details: err.flatten().fieldErrors,
    });
    return;
  }
  if (err && typeof err === "object" && "status" in err && typeof (err as { status: unknown }).status === "number") {
    const httpErr = err as { status: number; message?: string };
    res.status(httpErr.status).json({ error: httpErr.message ?? "Error" });
    return;
  }
  console.error("[unhandled]", err);
  res.status(500).json({ error: "Internal server error" });
}

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}
