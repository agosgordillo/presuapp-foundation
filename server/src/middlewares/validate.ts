import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

type Source = "body" | "query" | "params";

export const validate =
  (schema: ZodSchema, source: Source = "body") =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[source]);
      (req as unknown as Record<Source, unknown>)[source] = parsed;
      next();
    } catch (err) {
      next(err);
    }
  };
