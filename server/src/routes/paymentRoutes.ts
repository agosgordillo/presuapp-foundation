import { Router } from "express";
import { paymentController } from "../controllers/paymentController";
import { asyncHandler } from "../middlewares/errorHandler";
import { validate } from "../middlewares/validate";
import { paymentCreateSchema } from "../models/schemas";

const router = Router();

router.get("/project/:projectId", asyncHandler(paymentController.listByProject));
router.get("/project/:projectId/balance", asyncHandler(paymentController.balance));
router.post("/", validate(paymentCreateSchema), asyncHandler(paymentController.create));

export default router;
