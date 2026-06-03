import { Request, Response } from "express";
import { clientService } from "../services/clientService";
import { ClientCreateInput } from "../models/schemas";

export const clientController = {
  async list(_req: Request, res: Response): Promise<void> {
    const clients = await clientService.list();
    res.status(200).json({ error: false, data: clients });
  },

  async getById(req: Request, res: Response): Promise<void> {
    const client = await clientService.getById(req.params.id);
    res.status(200).json({ error: false, data: client });
  },

  async create(req: Request<unknown, unknown, ClientCreateInput>, res: Response): Promise<void> {
    const created = await clientService.create(req.body);
    res.status(201).json({ error: false, data: created });
  },
};
