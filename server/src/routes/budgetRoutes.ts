import { Router } from "express";
import { budgetController } from "../controllers/budgetController";
import { asyncHandler } from "../middlewares/errorHandler";
import { validate } from "../middlewares/validate";
import { budgetCreateSchema, budgetStatusUpdateSchema } from "../models/schemas";

const router = Router();

router.get("/", asyncHandler(budgetController.list));
router.get("/:id", asyncHandler(budgetController.getById));
router.post("/", validate(budgetCreateSchema), asyncHandler(budgetController.create));
router.patch(
  "/:id/status",
  validate(budgetStatusUpdateSchema),
  asyncHandler(budgetController.updateStatus),
);

export default router;
