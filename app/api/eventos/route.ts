// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * GET /api/eventos
 * Obtiene todos los eventos aprobados para el calendario
 */
export async function GET(request: NextRequest) {
  try {
    // Obtener parámetros de query
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const status = searchParams.get('status'); // Para filtrar por estado en moderación
    const role = searchParams.get('role'); // Debug role: 'admin' or 'user'
    
    const id = searchParams.get('id');

    // Usar admin client cuando:
    // - se solicitan todos los eventos (moderación)
    // - un evento específico por ID
    // For calendar view (no status param), use admin client to bypass RLS and show all approved events
    const useAdminClient = status === 'all' || id !== null || !status;
    const supabase = useAdminClient ? createAdminClient() : createClient();

    // Si se proporciona un ID, obtener ese evento específico
    if (id) {
      const { data: event, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error(`Error fetching event with id ${id}:`, error);
        return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
      }

      return NextResponse.json(event);
    }
    
    // Construir query base
    let query = supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: true });
    
    // Si se especifica status=all, mostrar todos los eventos (para moderación)
    // Si no se especifica, solo mostrar aprobados (para el calendario público)
    if (status === 'all') {
      // No filtrar por status, mostrar todos
    } else if (status) {
      query = query.eq('status', status);
    } else {
      query = query.eq('status', 'approved');
    }
    
    // Filtrar por rango de fechas si se proporciona
    if (start) {
      query = query.gte('start_date', start);
    }
    if (end) {
      query = query.lte('start_date', end);
    }
    
    const { data: events, error } = await query;
    
    if (error) {
      console.error('Error fetching events:', error);
      return NextResponse.json(
        { error: 'Error al obtener eventos' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(events);
    
  } catch (error) {
    console.error('Error in GET /api/eventos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/eventos
 * Crea un nuevo evento (desde formulario UGC)
 */
export async function POST(request: NextRequest) {
  try {
    // Usar admin client para evitar problemas de RLS
    const supabase = createAdminClient();
    
    // Parsear el body
    const body = await request.json();
    
    // Validar campos requeridos
    const requiredFields = ['title', 'description', 'start_date', 'location_name', 'location_city', 'organizer_name', 'featured_image'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `El campo ${field} es requerido` },
          { status: 400 }
        );
      }
    }

    // Generar short_description si no se proporciona
    const short_description = body.short_description || (body.description as string).substring(0, 150);
    
    // Generar slug base
    const baseSlug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + new Date().getFullYear();
    
    // Verificar si el slug ya existe y generar uno único
    let slug = baseSlug;
    let counter = 1;
    let slugExists = true;
    
    while (slugExists) {
      const { data: existingEvent } = await supabase
        .from('events')
        .select('slug')
        .eq('slug', slug)
        .maybeSingle();
      
      if (!existingEvent) {
        slugExists = false;
      } else {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }
    
    // Preparar datos del evento
    const eventData = {
      slug,
      title: body.title,
      description: body.description,
      short_description: short_description,
      start_date: body.start_date,
      end_date: body.end_date || null,
      start_time: body.start_time || null,
      end_time: body.end_time || null,
      location_name: body.location_name,
      location_address: body.location_address || null,
      location_city: body.location_city,
      location_country: body.location_country || 'España',
      organizer_name: body.organizer_name,
      organizer_email: body.organizer_email || null,
      organizer_phone: body.organizer_phone || null,
      featured_image: body.featured_image,
      event_type: body.event_type || 'otro',
      motorcycle_types: body.motorcycle_types || ['todas'],
      status: 'pending', // Siempre empieza como pendiente
      submitted_by: null, // Por ahora null hasta implementar auth
    };
    
    // Insertar en la base de datos
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select();
    
    if (error) {
      console.error('Error creating event:', error);
      return NextResponse.json(
        { error: 'Error al crear el evento' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data[0], { status: 201 });
    
  } catch (error) {
    console.error('Error in POST /api/eventos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/eventos
 * Actualiza el estado de un evento (para moderación)
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    const body = await request.json();
    const { id, status, moderationNotes, rejectionReason } = body;
    
    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID y status son requeridos' },
        { status: 400 }
      );
    }
    
    // Validar que el status sea válido
    const validStatuses = ['pending', 'needs_edit', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Status no válido' },
        { status: 400 }
      );
    }
    
    // Preparar datos de actualización
    const updateData: any = {
      status,
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
      .select();
    
    if (error) {
      console.error('Error updating event status:', error);
      return NextResponse.json(
        { error: 'Error al actualizar el evento' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data[0]);
    
  } catch (error) {
    console.error('Error in PATCH /api/eventos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/eventos
 * Actualiza un evento completo (para editar antes de validar)
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    const body = await request.json();
    const { id, ...eventData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID es requerido' },
        { status: 400 }
      );
    }
    
    // Actualizar en la base de datos
    const { data, error } = await supabase
      .from('events')
      .update({
        ...eventData,
      })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating event:', error);
      return NextResponse.json(
        { error: 'Error al actualizar el evento' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data[0]);
    
  } catch (error) {
    console.error('Error in PUT /api/eventos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
