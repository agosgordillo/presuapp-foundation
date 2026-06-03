import { Request, Response } from "express";
import { BudgetStatus } from "@prisma/client";
import { budgetService } from "../services/budgetService";
import { BudgetCreateInput } from "../models/schemas";

export const budgetController = {
  async list(req: Request, res: Response): Promise<void> {
    const { search, status } = req.query as { search?: string; status?: string };
    const data = await budgetService.list({ search, status });
    res.status(200).json({ error: false, data });
  },

  async getById(req: Request, res: Response): Promise<void> {
    res.status(200).json({ error: false, data: await budgetService.getById(req.params.id) });
  },

  async create(req: Request<unknown, unknown, BudgetCreateInput>, res: Response): Promise<void> {
    const created = await budgetService.create(req.body);
    res.status(201).json({ error: false, data: created });
  },

  async updateStatus(
    req: Request<{ id: string }, unknown, { status: BudgetStatus }>,
    res: Response,
  ): Promise<void> {
    const updated = await budgetService.updateStatus(req.params.id, req.body.status);
    res.status(200).json({ error: false, data: updated });
  },
};
