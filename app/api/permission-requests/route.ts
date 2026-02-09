// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * GET /api/permission-requests
 * Lista todas las solicitudes (admin) o las del usuario actual
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    let query = supabase
      .from('permission_requests')
      .select(`
        *,
        profiles!user_id (
          email,
          full_name,
          role
        )
      `)
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching permission requests:', error);
      return NextResponse.json(
        { error: 'Error al obtener solicitudes' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in GET /api/permission-requests:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/permission-requests
 * Crear una nueva solicitud
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();
    const { user_id, request_type, reason, organization } = body;

    // Validar campos requeridos
    if (!user_id || !request_type) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Validar tipo de solicitud
    if (!['contributor', 'moderator'].includes(request_type)) {
      return NextResponse.json(
        { error: 'Tipo de solicitud inválido' },
        { status: 400 }
      );
    }

    // Insertar solicitud
    const { data, error } = await supabase
      .from('permission_requests')
      .insert({
        user_id,
        request_type,
        reason,
        organization,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating permission request:', error);
      return NextResponse.json(
        { error: 'Error al crear solicitud' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in POST /api/permission-requests:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
