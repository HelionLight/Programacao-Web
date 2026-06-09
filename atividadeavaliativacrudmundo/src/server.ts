import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import continentsRouter from "./routes/continents";
import countriesRouter from "./routes/countries";
import citiesRouter from "./routes/cities";
import externalRouter from "./routes/external";
import prisma from "./prisma";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT ?? 4000);
const publicPath = path.join(__dirname, "..", "public");

app.use(cors());
app.use(express.json());
app.use(express.static(publicPath));

app.use("/api/auth", authRouter);
app.use("/api/continents", continentsRouter);
app.use("/api/countries", countriesRouter);
app.use("/api/cities", citiesRouter);
app.use("/api/external", externalRouter);

app.get("/api/health", (_req, res) => {
  return res.json({ status: "ok" });
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log(`Servidor iniciado em http://localhost:${PORT}`);
  } catch (error) {
    console.error("Falha ao conectar com o banco de dados:", error);
  }
});
