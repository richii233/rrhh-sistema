// frontend/supabase-client.js

// 1. Reemplaza estos datos con los de tu proyecto de Supabase
const SUPABASE_URL = "https://tu-proyecto-id.supabase.co";
const SUPABASE_ANON_KEY = "tu-anon-key-super-larga...";

// 2. Cargamos el cliente de Supabase directamente desde su CDN oficial
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// 3. Inicializamos la instancia de la base de datos una sola vez
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
