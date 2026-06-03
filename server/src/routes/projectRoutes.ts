import { Router } from "express";
import { projectController } from "../controllers/projectController";
import { asyncHandler } from "../middlewares/errorHandler";
import { validate } from "../middlewares/validate";
import { projectCreateSchema } from "../models/schemas";

const router = Router();

router.get("/", asyncHandler(projectController.list));
router.get("/:id", asyncHandler(projectController.getById));
router.post("/", validate(projectCreateSchema), asyncHandler(projectController.create));

export default router;
