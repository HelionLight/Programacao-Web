import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "2h",
  });

  return res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

export default router;
