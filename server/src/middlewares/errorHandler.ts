import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export class HttpError extends Error {
  public readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "HttpError";
  }
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    error: true,
    message: "Endpoint no encontrado.",
  });
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: true,
      message: "Validación fallida: " + err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; "),
    });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.status).json({ error: true, message: err.message });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      res.status(409).json({
        error: true,
        message: "Conflicto: ya existe un registro con un valor único duplicado.",
      });
      return;
    }
    if (err.code === "P2025") {
      res.status(404).json({ error: true, message: "Registro no encontrado." });
      return;
    }
  }

  const message = err instanceof Error ? err.message : "Error interno del servidor.";
  console.error("[Unhandled Error]", err);
  res.status(500).json({ error: true, message });
}

// Async wrapper to forward rejected promises to errorHandler.
export const asyncHandler =
  <T extends Request = Request>(fn: (req: T, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req as T, res, next)).catch(next);
  };
