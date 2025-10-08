// src/infrastructure/security/authMiddleware.js
import { verifyToken } from "./jwt.js";

export const authMiddleware = (req, res, next) => {
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
    req.user = decoded; // injeta dados do usuário autenticado (id, role, email)
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
};
