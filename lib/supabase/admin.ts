import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

/**
 * Cliente Supabase con Service Role Key (Admin)
 * ⚠️ SOLO usar en Server Actions y API Routes seguras
 * Este cliente ignora RLS y tiene acceso total
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
