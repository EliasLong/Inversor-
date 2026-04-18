import express from 'express';
import { getMarketData } from '../scrapers/ambito.js';
import { getMerval } from '../scrapers/rava.js';

const router = express.Router();

router.get('/dolar', async (req, res) => {
  try {
    const data = await getMarketData();
    res.json(data);
  } catch (error) {
    console.error('Error en GET /api/market/dolar:', error);
    res.status(500).json({ error: 'Error al obtener datos del mercado' });
  }
});

router.get('/merval', async (req, res) => {
  try {
    const data = await getMerval();
    res.json(data);
  } catch (error) {
    console.error('Error en GET /api/market/merval:', error);
    res.status(500).json({ error: 'Error al obtener datos del Merval' });
  }
});

export default router;

