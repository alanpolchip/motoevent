// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * GET /api/permission-requests
 * Listar solicitudes (solo admins)
 * Query params: status=pending|approved|rejected|all
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') ?? 'pending';

    let query = supabase
      .from('permission_requests')
      .select(`
        *,
        profiles!user_id (
          id,
          email,
          full_name,
          role,
          can_submit_events,
          can_moderate_events
        )
      `)
      .order('created_at', { ascending: false });

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching permission requests:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error('Error in GET /api/permission-requests:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
