import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database';

/**
 * Cliente Supabase para el navegador (Client Components)
 * Usar en useEffect, event handlers, etc.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
