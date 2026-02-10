// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * PATCH /api/permission-requests/[id]
 * Aprobar o rechazar una solicitud (solo admins)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminClient();
    const { id } = params;
    const body = await request.json();
    const { action, reviewed_by, rejection_reason } = body;

    // Validar acción
    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Acción inválida' },
        { status: 400 }
      );
    }

    // Obtener la solicitud
    const { data: request_data, error: fetchError } = await supabase
      .from('permission_requests')
      .select('*, profiles!user_id(*)')
      .eq('id', id)
      .single();

    if (fetchError || !request_data) {
      return NextResponse.json(
        { error: 'Solicitud no encontrada' },
        { status: 404 }
      );
    }

    // Si se aprueba, actualizar el perfil del usuario
    if (action === 'approve') {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (request_data.request_type === 'contributor') {
        updateData.can_submit_events = true;
        // role se queda como 'user', solo se activa el flag
      } else if (request_data.request_type === 'moderator') {
        updateData.can_submit_events = true;
        updateData.can_moderate_events = true;
        updateData.role = 'moderator';
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', request_data.user_id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        return NextResponse.json(
          { error: 'Error al actualizar perfil' },
          { status: 500 }
        );
      }
    }

    // Actualizar la solicitud
    const { data, error } = await supabase
      .from('permission_requests')
      .update({
        status: action === 'approve' ? 'approved' : 'rejected',
        reviewed_by,
        reviewed_at: new Date().toISOString(),
        rejection_reason: action === 'reject' ? rejection_reason : null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating permission request:', error);
      return NextResponse.json(
        { error: 'Error al actualizar solicitud' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in PATCH /api/permission-requests/[id]:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
