import { prisma } from "../config/prisma";
import { HttpError } from "../middlewares/errorHandler";
import { PaymentCreateInput } from "../models/schemas";

export const paymentService = {
  async listByProject(projectId: string) {
    return prisma.payment.findMany({
      where: { projectId },
      orderBy: { date: "desc" },
    });
  },

  async getProjectBalance(projectId: string) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new HttpError(404, `Proyecto '${projectId}' no encontrado.`);

    const accepted = await prisma.budget.aggregate({
      _sum: { total: true },
      where: { projectId, status: "ACCEPTED" },
    });
    const payments = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { projectId },
    });

    const contractValue = accepted._sum.total ?? 0;
    const paid = payments._sum.amount ?? 0;
    const outstanding = Math.max(0, contractValue - paid);

    return { projectId, contractValue, paid, outstanding };
  },

  async create(input: PaymentCreateInput) {
    const balance = await this.getProjectBalance(input.projectId);

    if (balance.contractValue === 0) {
      throw new HttpError(
        400,
        "El proyecto no tiene presupuestos ACCEPTED. No se pueden registrar pagos sin un valor de contrato.",
      );
    }
    if (input.amount > balance.outstanding) {
      throw new HttpError(
        400,
        `El pago (${input.amount.toFixed(2)}) excede el saldo pendiente del proyecto (${balance.outstanding.toFixed(2)}).`,
      );
    }

    return prisma.payment.create({
      data: {
        projectId: input.projectId,
        amount: input.amount,
        method: input.method,
        notes: input.notes,
        date: input.date ?? new Date(),
      },
    });
  },
};
