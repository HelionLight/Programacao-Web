import { Router } from "express";
import prisma from "../prisma";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", async (req, res) => {
  const continents = await prisma.continent.findMany({
    include: { countries: true },
    orderBy: { name: "asc" },
  });
  return res.json(continents);
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const continent = await prisma.continent.findUnique({
    where: { id },
    include: { countries: true },
  });

  if (!continent) {
    return res.status(404).json({ error: "Continente não encontrado" });
  }

  return res.json(continent);
});

router.post("/", authMiddleware, async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: "Nome e descrição são obrigatórios" });
  }

  const continent = await prisma.continent.create({
    data: { name, description },
  });
  return res.status(201).json(continent);
});

router.put("/:id", authMiddleware, async (req, res) => {
  const id = Number(req.params.id);
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: "Nome e descrição são obrigatórios" });
  }

  try {
    const continent = await prisma.continent.update({
      where: { id },
      data: { name, description },
    });
    return res.json(continent);
  } catch {
    return res.status(404).json({ error: "Continente não encontrado" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.continent.delete({ where: { id } });
    return res.status(204).send();
  } catch {
    return res.status(404).json({ error: "Continente não encontrado" });
  }
});

export default router;
