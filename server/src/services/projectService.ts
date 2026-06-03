import { prisma } from "../config/prisma";
import { HttpError } from "../middlewares/errorHandler";
import { ProjectCreateInput } from "../models/schemas";

export const projectService = {
  async list() {
    return prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: { client: true },
    });
  },

  async getById(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { client: true, budgets: true, payments: true },
    });
    if (!project) throw new HttpError(404, `Proyecto con id '${id}' no encontrado.`);
    return project;
  },

  async create(input: ProjectCreateInput) {
    const client = await prisma.client.findUnique({ where: { id: input.clientId } });
    if (!client) {
      throw new HttpError(404, `El cliente '${input.clientId}' no existe. No se puede crear el proyecto.`);
    }
    return prisma.project.create({
      data: {
        name: input.name,
        description: input.description,
        clientId: input.clientId,
        status: input.status ?? "ACTIVE",
      },
    });
  },
};
