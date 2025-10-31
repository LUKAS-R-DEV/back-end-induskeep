// src/infrastructure/config/env.js
import dotenv from "dotenv";
dotenv.config();

const required = ["DATABASE_URL", "JWT_SECRET", "PORT"];

required.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️  Variável de ambiente ausente: ${key}`);
  }
});

export default {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: Number(process.env.PORT || 3000),
  NODE_ENV: process.env.NODE_ENV || "development",
  FRONTEND_URL: process.env.FRONTEND_URL,
};
