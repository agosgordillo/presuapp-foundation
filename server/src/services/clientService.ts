import { prisma } from "../config/prisma";
import { HttpError } from "../middlewares/errorHandler";
import { ClientCreateInput } from "../models/schemas";

export const clientService = {
  async list() {
    return prisma.client.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { projects: true, budgets: true } } },
    });
  },

  async getById(id: string) {
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        projects: {
          orderBy: { createdAt: "desc" },
          include: { _count: { select: { budgets: true, payments: true } } },
        },
      },
    });
    if (!client) throw new HttpError(404, `Cliente con id '${id}' no encontrado.`);
    return client;
  },

  async create(input: ClientCreateInput) {
    const existing = await prisma.client.findUnique({ where: { email: input.email } });
    if (existing) {
      throw new HttpError(409, `Ya existe un cliente registrado con el email '${input.email}'.`);
    }
    return prisma.client.create({ data: input });
  },
};
