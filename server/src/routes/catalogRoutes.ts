import { Router } from "express";
import { catalogController } from "../controllers/catalogController";
import { asyncHandler } from "../middlewares/errorHandler";
import { validate } from "../middlewares/validate";
import { catalogItemSchema } from "../models/schemas";

const router = Router();

router.get("/", asyncHandler(catalogController.list));
router.post("/", validate(catalogItemSchema), asyncHandler(catalogController.create));

export default router;
