import { AppError } from "../../shared/errors/AppError.js";

export function errorHandler(err, req, res, next) {
  console.error("❌ Erro capturado pelo errorHandler:");
  console.error("❌ Mensagem:", err.message);
  console.error("❌ Código:", err.code);
  console.error("❌ Stack:", err.stack);
  console.error("❌ URL:", req.originalUrl);
  console.error("❌ Método:", req.method);
  console.error("❌ Parâmetros:", req.params);
  console.error("❌ Usuário:", req.user?.id);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // Prisma Validation / Unique constraint
  if (err.code === "P2002") {
    return res.status(409).json({
      status: "error",
      message: "Registro duplicado — esse valor já existe.",
    });
  }

  // Prisma Foreign key
  if (err.code === "P2003") {
    return res.status(400).json({
      status: "error",
      message: "Referência inválida — entidade relacionada não encontrada.",
    });
  }

  // Prisma Record not found
  if (err.code === "P2025") {
    return res.status(404).json({
      status: "error",
      message: "Registro não encontrado.",
    });
  }

  // Default fallback
  return res.status(500).json({
    status: "error",
    message: err.message || "Erro interno do servidor.",
    details: process.env.NODE_ENV === "development" ? {
      message: err.message,
      stack: err.stack,
      code: err.code,
      name: err.name
    } : undefined,
  });
}
