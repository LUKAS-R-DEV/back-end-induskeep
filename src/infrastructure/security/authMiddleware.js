// src/infrastructure/security/authMiddleware.js
import { verifyToken } from "./jwt.js";
import prisma from "../database/prismaClient.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Token não fornecido." });
    }

    // O formato deve ser: Bearer <token>
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ error: "Token mal formatado." });
    }

    const decoded = verifyToken(token);

    const dbUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true, email: true, isActive: true },
    });

    if (!dbUser) {
      return res.status(401).json({ error: "Usuário não encontrado." });
    }

    if (dbUser.isActive === false) {
      return res.status(403).json({ error: "Usuário inativo." });
    }

    req.user = { id: dbUser.id, role: dbUser.role, email: dbUser.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
};
