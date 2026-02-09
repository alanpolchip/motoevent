import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const createAdminClient = () => {
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
};

/**
 * GET /api/eventos/[id]
 * Obtiene un evento específico por ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminClient();
    const { id } = params;

    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching event:', error);
      return NextResponse.json(
        { error: 'Error al obtener el evento' },
        { status: 500 }
      );
    }

    if (!event) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(event);

  } catch (error) {
    console.error('Error in GET /api/eventos/[id]:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/eventos/[id]
 * Actualiza el estado de un evento (para moderación)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminClient();
    const { id } = params;

    const body = await request.json();
    const { status, rejectionReason, moderationNotes } = body;

    // Validar que el status sea válido
    const validStatuses = ['pending', 'needs_edit', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Status no válido' },
        { status: 400 }
      );
    }

    // Preparar datos de actualización
    const updateData: EventUpdate = {
      status,
      updated_at: new Date().toISOString(),
    };

    // Si se aprueba, registrar fecha de moderación
    if (status === 'approved') {
      updateData.moderated_at = new Date().toISOString();
    }

    // Si se rechaza, guardar el motivo
    if (status === 'rejected' && rejectionReason) {
      updateData.rejection_reason = rejectionReason;
    }

    // Actualizar en la base de datos
    const { data, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating event status:', error);
      return NextResponse.json(
        { error: 'Error al actualizar el evento' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in PATCH /api/eventos/[id]:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/eventos/[id]
 * Actualiza un evento completo (para editar antes de validar)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminClient();
    const { id } = params;

    const body = await request.json();

    // Preparar datos de actualización
    const updateData: EventUpdate = {
      ...body,
      updated_at: new Date().toISOString(),
    };

    // Actualizar en la base de datos
    const { data, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating event:', error);
      return NextResponse.json(
        { error: 'Error al actualizar el evento' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in PUT /api/eventos/[id]:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
