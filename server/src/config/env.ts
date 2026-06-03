import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  CORS_ORIGIN: string;
}

export const env: EnvConfig = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL || "file:./dev.db",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
};
