import { prisma } from "../config/prisma";
import { CatalogItemInput } from "../models/schemas";

export const catalogService = {
  async list() {
    return prisma.itemCatalog.findMany({ orderBy: { createdAt: "desc" } });
  },

  async create(input: CatalogItemInput) {
    return prisma.itemCatalog.create({ data: input });
  },
};
