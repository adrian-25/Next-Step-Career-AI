import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check that the URL is a real HTTP/HTTPS URL, not a placeholder string
const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const hasValidCredentials = supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl);

if (!hasValidCredentials) {
  console.warn(
    '⚠️ Supabase credentials not configured. Running in offline/demo mode.',
    '\nTo enable Supabase, add real values to your .env file and restart the dev server.'
  );
}

// Use real credentials if valid; otherwise fall back to a safe placeholder client
export const supabase: SupabaseClient = hasValidCredentials
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : createClient('https://placeholder.supabase.co', 'placeholder-anon-key');