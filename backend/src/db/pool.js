import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL o Secret Key no están configurados en el archivo .env');
}

// Crear cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);
