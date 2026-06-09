import { Router } from "express";
import prisma from "../prisma";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", async (req, res) => {
  const page = Number(req.query.page ?? 1);
  const limit = Math.min(Number(req.query.limit ?? 10), 30);
  const countryId = req.query.countryId ? Number(req.query.countryId) : undefined;
  const continentId = req.query.continentId ? Number(req.query.continentId) : undefined;

  const where: any = {};
  if (countryId) {
    where.countryId = countryId;
  }
  if (continentId) {
    where.country = { continentId };
  }

  const [cities, total] = await Promise.all([
    prisma.city.findMany({
      where,
      include: { country: { include: { continent: true } } },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: "asc" },
    }),
    prisma.city.count({ where }),
  ]);

  return res.json({ cities, total, page, limit });
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const city = await prisma.city.findUnique({
    where: { id },
    include: { country: { include: { continent: true } } },
  });

  if (!city) {
    return res.status(404).json({ error: "Cidade não encontrada" });
  }

  return res.json(city);
});

router.post("/", authMiddleware, async (req, res) => {
  const { name, population, latitude, longitude, countryId } = req.body;
  if (!name || !population || latitude === undefined || longitude === undefined || !countryId) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const city = await prisma.city.create({
    data: {
      name,
      population: Number(population),
      latitude: Number(latitude),
      longitude: Number(longitude),
      countryId: Number(countryId),
    },
    include: { country: { include: { continent: true } } },
  });

  return res.status(201).json(city);
});

router.put("/:id", authMiddleware, async (req, res) => {
  const id = Number(req.params.id);
  const { name, population, latitude, longitude, countryId } = req.body;
  if (!name || !population || latitude === undefined || longitude === undefined || !countryId) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    const city = await prisma.city.update({
      where: { id },
      data: {
        name,
        population: Number(population),
        latitude: Number(latitude),
        longitude: Number(longitude),
        countryId: Number(countryId),
      },
      include: { country: { include: { continent: true } } },
    });
    return res.json(city);
  } catch {
    return res.status(404).json({ error: "Cidade não encontrada" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.city.delete({ where: { id } });
    return res.status(204).send();
  } catch {
    return res.status(404).json({ error: "Cidade não encontrada" });
  }
});

export default router;
