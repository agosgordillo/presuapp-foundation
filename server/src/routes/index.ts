import { Router } from "express";
import clientRoutes from "./clientRoutes";
import projectRoutes from "./projectRoutes";
import catalogRoutes from "./catalogRoutes";
import budgetRoutes from "./budgetRoutes";
import paymentRoutes from "./paymentRoutes";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({ error: false, status: "ok", service: "PresuApp API" });
});

router.use("/clients", clientRoutes);
router.use("/projects", projectRoutes);
router.use("/catalog", catalogRoutes);
router.use("/quotes", budgetRoutes);
router.use("/payments", paymentRoutes);

export default router;
