import { Request, Response } from "express";
import { paymentService } from "../services/paymentService";
import { PaymentCreateInput } from "../models/schemas";

export const paymentController = {
  async listByProject(req: Request, res: Response): Promise<void> {
    const data = await paymentService.listByProject(req.params.projectId);
    res.status(200).json({ error: false, data });
  },

  async balance(req: Request, res: Response): Promise<void> {
    const data = await paymentService.getProjectBalance(req.params.projectId);
    res.status(200).json({ error: false, data });
  },

  async create(req: Request<unknown, unknown, PaymentCreateInput>, res: Response): Promise<void> {
    const created = await paymentService.create(req.body);
    res.status(201).json({ error: false, data: created });
  },
};
