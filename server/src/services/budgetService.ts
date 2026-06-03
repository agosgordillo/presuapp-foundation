import { BudgetStatus } from "@prisma/client";
import { prisma } from "../config/prisma";
import { HttpError } from "../middlewares/errorHandler";
import { BudgetCreateInput } from "../models/schemas";

const VALID_STATUSES: BudgetStatus[] = ["DRAFT", "SENT", "VIEWED", "ACCEPTED", "REJECTED"];

// State machine: DRAFT -> SENT -> VIEWED -> ACCEPTED|REJECTED
const ALLOWED_TRANSITIONS: Record<BudgetStatus, BudgetStatus[]> = {
  DRAFT: ["SENT"],
  SENT: ["VIEWED", "ACCEPTED", "REJECTED"],
  VIEWED: ["ACCEPTED", "REJECTED"],
  ACCEPTED: [],
  REJECTED: [],
};

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

async function nextShortId(): Promise<string> {
  const count = await prisma.budget.count();
  return `#${String(count + 1).padStart(3, "0")}`;
}

export const budgetService = {
  async list(filters: { search?: string; status?: string }) {
    const statuses = filters.status
      ? (filters.status
          .split(",")
          .map((s) => s.trim().toUpperCase())
          .filter((s): s is BudgetStatus => VALID_STATUSES.includes(s as BudgetStatus)))
      : undefined;

    return prisma.budget.findMany({
      where: {
        AND: [
          statuses && statuses.length > 0 ? { status: { in: statuses } } : {},
          filters.search
            ? {
                OR: [
                  { id: { contains: filters.search } },
                  { client: { name: { contains: filters.search } } },
                  { client: { company: { contains: filters.search } } },
                  { project: { name: { contains: filters.search } } },
                ],
              }
            : {},
        ],
      },
      include: { client: true, project: true, items: true },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string) {
    const budget = await prisma.budget.findUnique({
      where: { id },
      include: { client: true, project: true, items: true },
    });
    if (!budget) throw new HttpError(404, `Presupuesto '${id}' no encontrado.`);
    return budget;
  },

  async create(input: BudgetCreateInput) {
    const client = await prisma.client.findUnique({ where: { id: input.clientId } });
    if (!client) throw new HttpError(404, `Cliente '${input.clientId}' no encontrado.`);

    if (input.projectId) {
      const project = await prisma.project.findUnique({ where: { id: input.projectId } });
      if (!project) throw new HttpError(404, `Proyecto '${input.projectId}' no encontrado.`);
      if (project.clientId !== input.clientId) {
        throw new HttpError(400, "El proyecto no pertenece al cliente especificado.");
      }
    }

    // Automated cascading math.
    const itemsWithSubtotal = input.items.map((item) => ({
      ...item,
      subtotal: round2(item.quantity * item.unitPrice),
    }));
    const subtotal = round2(itemsWithSubtotal.reduce((acc, i) => acc + i.subtotal, 0));
    const taxAmount = round2(subtotal * (input.taxPercentage / 100));
    const total = round2(subtotal + taxAmount);

    const shortId = await nextShortId();

    return prisma.budget.create({
      data: {
        id: shortId,
        clientId: input.clientId,
        projectId: input.projectId,
        status: "DRAFT",
        subtotal,
        taxPercentage: input.taxPercentage,
        total,
        items: { create: itemsWithSubtotal },
      },
      include: { items: true, client: true, project: true },
    });
  },

  async updateStatus(id: string, next: BudgetStatus) {
    const current = await prisma.budget.findUnique({ where: { id } });
    if (!current) throw new HttpError(404, `Presupuesto '${id}' no encontrado.`);

    const allowed = ALLOWED_TRANSITIONS[current.status];
    if (!allowed.includes(next)) {
      throw new HttpError(
        400,
        `Transición inválida: '${current.status}' -> '${next}'. Permitidas: [${allowed.join(", ") || "ninguna (estado terminal)"}].`,
      );
    }

    return prisma.budget.update({ where: { id }, data: { status: next } });
  },
};
