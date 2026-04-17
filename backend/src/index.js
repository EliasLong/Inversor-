import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './db/pool.js';
import marketRoutes from './routes/market.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/market', marketRoutes);
app.get('/api/health', async (req, res) => {
  try {
    const { count, error } = await supabase
      .from('cotizaciones')
      .select('*', { count: 'exact', head: true });

    if (error) {
      throw error;
    }

    res.json({
      status: 'ok',
      db: 'connected',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Supabase connection error:', error);
    res.status(500).json({
      status: 'error',
      db: 'disconnected',
      timestamp: new Date(),
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
