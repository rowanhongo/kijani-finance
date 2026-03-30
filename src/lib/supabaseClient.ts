import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

function validUrl(u?: string) {
  return typeof u === 'string' && (u.startsWith('http://') || u.startsWith('https://'));
}

let supabase: SupabaseClient | null = null;
if (validUrl(url) && anon) {
  supabase = createClient(url, anon);
}

export { supabase };
