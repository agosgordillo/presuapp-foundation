import { Router } from "express";
import { clientController } from "../controllers/clientController";
import { asyncHandler } from "../middlewares/errorHandler";
import { validate } from "../middlewares/validate";
import { clientCreateSchema } from "../models/schemas";

const router = Router();

router.get("/", asyncHandler(clientController.list));
router.get("/:id", asyncHandler(clientController.getById));
router.post("/", validate(clientCreateSchema), asyncHandler(clientController.create));

export default router;
