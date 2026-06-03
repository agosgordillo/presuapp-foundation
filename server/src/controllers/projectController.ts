import { Request, Response } from "express";
import { projectService } from "../services/projectService";
import { ProjectCreateInput } from "../models/schemas";

export const projectController = {
  async list(_req: Request, res: Response): Promise<void> {
    res.status(200).json({ error: false, data: await projectService.list() });
  },

  async getById(req: Request, res: Response): Promise<void> {
    res.status(200).json({ error: false, data: await projectService.getById(req.params.id) });
  },

  async create(req: Request<unknown, unknown, ProjectCreateInput>, res: Response): Promise<void> {
    const created = await projectService.create(req.body);
    res.status(201).json({ error: false, data: created });
  },
};
