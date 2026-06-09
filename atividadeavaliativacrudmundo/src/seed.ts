import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

dotenv.config();

async function main() {
  const passwordHash = await bcrypt.hash("Admin123!", 10);

  await prisma.user.upsert({
    where: { email: "admin@crudmundo.local" },
    update: {
      name: "Admin CRUD Mundo",
      password: passwordHash,
    },
    create: {
      email: "admin@crudmundo.local",
      name: "Admin CRUD Mundo",
      password: passwordHash,
    },
  });

  const continent = await prisma.continent.findFirst({ where: { name: "América do Sul" } });
  const continentRecord =
    continent ||
    (await prisma.continent.create({
      data: {
        name: "América do Sul",
        description: "Continente com países e cidades para testar o CRUD.",
      },
    }));

  const country = await prisma.country.findFirst({ where: { name: "Brasil" } });
  const countryRecord =
    country ||
    (await prisma.country.create({
      data: {
        name: "Brasil",
        population: 214000000,
        officialLanguage: "Português",
        currency: "Real",
        continentId: continentRecord.id,
      },
    }));

  const city = await prisma.city.findFirst({ where: { name: "São Paulo" } });
  if (!city) {
    await prisma.city.create({
      data: {
        name: "São Paulo",
        population: 12300000,
        latitude: -23.55052,
        longitude: -46.633308,
        countryId: countryRecord.id,
      },
    });
  }

  console.log("Seed concluído. Usuário inicial criado: admin@crudmundo.local / Admin123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
