import { Request, Response } from "express";
import { catalogService } from "../services/catalogService";
import { CatalogItemInput } from "../models/schemas";

export const catalogController = {
  async list(_req: Request, res: Response): Promise<void> {
    res.status(200).json({ error: false, data: await catalogService.list() });
  },

  async create(req: Request<unknown, unknown, CatalogItemInput>, res: Response): Promise<void> {
    const created = await catalogService.create(req.body);
    res.status(201).json({ error: false, data: created });
  },
};
