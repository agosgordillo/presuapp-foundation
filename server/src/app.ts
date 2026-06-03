import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env";
import { disconnectPrisma } from "./config/prisma";
import apiRouter from "./routes";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";

const app: Application = express();

// ---------- Global Middlewares ----------
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN.split(",").map((o) => o.trim()),
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

// ---------- Routes ----------
app.get("/", (_req, res) => {
  res.json({
    error: false,
    service: "PresuApp API",
    version: "1.0.0",
    docs: "/api/health",
  });
});
app.use("/api", apiRouter);

// ---------- 404 + Global Error Handler ----------
app.use(notFoundHandler);
app.use(errorHandler);

// ---------- Bootstrap ----------
const server = app.listen(env.PORT, () => {
  console.log(`🚀 PresuApp API running at http://localhost:${env.PORT}`);
  console.log(`📡 Environment: ${env.NODE_ENV}`);
});

// Graceful shutdown
const shutdown = async (signal: string): Promise<void> => {
  console.log(`\n[${signal}] Shutting down gracefully...`);
  server.close(async () => {
    await disconnectPrisma();
    process.exit(0);
  });
};

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

export default app;
