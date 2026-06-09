import { Router } from "express";
import fetch from "node-fetch";

const router = Router();
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

router.get("/country/:code", async (req, res) => {
  const code = req.params.code;
  try {
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
    if (!response.ok) {
      return res.status(404).json({ error: "País não encontrado na API externa" });
    }
    const data = (await response.json()) as any[];
    return res.json(data[0]);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao consultar API de países" });
  }
});

router.get("/weather/:city", async (req, res) => {
  const city = req.params.city;
  if (!OPENWEATHER_API_KEY) {
    return res.status(500).json({ error: "OpenWeatherMap API key não configurada" });
  }

  const country = req.query.country ? `,${String(req.query.country)}` : "";
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city + country)}&units=metric&lang=pt_br&appid=${OPENWEATHER_API_KEY}`
    );
    if (!response.ok) {
      return res.status(404).json({ error: "Cidade não encontrada na API de clima" });
    }
    const data = await response.json();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao consultar API de clima" });
  }
});

export default router;
