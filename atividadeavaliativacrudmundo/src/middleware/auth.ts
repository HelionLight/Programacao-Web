import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

export interface AuthRequest extends Request {
  user?: { userId: number; email: string };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
    req.user = { userId: payload.userId, email: payload.email };
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}
