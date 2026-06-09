import { Router } from "express";
import prisma from "../prisma";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", async (req, res) => {
  const page = Number(req.query.page ?? 1);
  const limit = Math.min(Number(req.query.limit ?? 8), 30);
  const continentId = req.query.continentId ? Number(req.query.continentId) : undefined;

  const where: any = {};
  if (continentId) where.continentId = continentId;

  const [countries, total] = await Promise.all([
    prisma.country.findMany({
      where,
      include: { continent: true, cities: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: "asc" },
    }),
    prisma.country.count({ where }),
  ]);

  return res.json({ countries, total, page, limit });
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const country = await prisma.country.findUnique({
    where: { id },
    include: { continent: true, cities: true },
  });
  if (!country) {
    return res.status(404).json({ error: "País não encontrado" });
  }
  return res.json(country);
});

router.post("/", authMiddleware, async (req, res) => {
  const { name, population, officialLanguage, currency, continentId } = req.body;
  if (!name || !population || !officialLanguage || !currency || !continentId) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const country = await prisma.country.create({
    data: {
      name,
      population: Number(population),
      officialLanguage,
      currency,
      continentId: Number(continentId),
    },
  });
  return res.status(201).json(country);
});

router.put("/:id", authMiddleware, async (req, res) => {
  const id = Number(req.params.id);
  const { name, population, officialLanguage, currency, continentId } = req.body;
  if (!name || !population || !officialLanguage || !currency || !continentId) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    const country = await prisma.country.update({
      where: { id },
      data: {
        name,
        population: Number(population),
        officialLanguage,
        currency,
        continentId: Number(continentId),
      },
    });
    return res.json(country);
  } catch {
    return res.status(404).json({ error: "País não encontrado" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.country.delete({ where: { id } });
    return res.status(204).send();
  } catch {
    return res.status(404).json({ error: "País não encontrado" });
  }
});

export default router;
