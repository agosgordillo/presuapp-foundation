import { z } from "zod";

// ============================================================
// CLIENTS
// ============================================================
export const clientCreateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  company: z.string().trim().min(1).max(160),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(4).max(40),
});
export type ClientCreateInput = z.infer<typeof clientCreateSchema>;

// ============================================================
// PROJECTS
// ============================================================
export const projectCreateSchema = z.object({
  name: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).optional(),
  clientId: z.string().uuid(),
  status: z.enum(["ACTIVE", "CLOSED"]).optional(),
});
export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;

// ============================================================
// ITEM CATALOG
// ============================================================
export const catalogItemSchema = z.object({
  name: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(1000),
  unitType: z.enum(["HR", "U", "SVC", "MES", "PROY"]),
  referencePrice: z.number().nonnegative(),
  category: z.string().trim().min(1).max(80),
});
export type CatalogItemInput = z.infer<typeof catalogItemSchema>;

// ============================================================
// BUDGETS / QUOTES
// ============================================================
export const budgetItemSchema = z.object({
  name: z.string().trim().min(1).max(160),
  description: z.string().trim().max(500).default(""),
  unitType: z.string().trim().min(1).max(20),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
});

export const budgetCreateSchema = z.object({
  clientId: z.string().uuid(),
  projectId: z.string().uuid().optional(),
  taxPercentage: z.number().min(0).max(100).default(21),
  items: z.array(budgetItemSchema).min(1, "Un presupuesto debe tener al menos un ítem."),
});
export type BudgetCreateInput = z.infer<typeof budgetCreateSchema>;

export const budgetStatusUpdateSchema = z.object({
  status: z.enum(["DRAFT", "SENT", "VIEWED", "ACCEPTED", "REJECTED"]),
});

export const budgetQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z.string().trim().optional(),
});

// ============================================================
// PAYMENTS
// ============================================================
export const paymentCreateSchema = z.object({
  projectId: z.string().uuid(),
  amount: z.number().positive("El monto debe ser mayor a 0."),
  method: z.enum(["TRANSFER", "CARD", "CASH", "CHEQUE", "OTHER"]),
  notes: z.string().trim().max(1000).optional(),
  date: z.coerce.date().optional(),
});
export type PaymentCreateInput = z.infer<typeof paymentCreateSchema>;
