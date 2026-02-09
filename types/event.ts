// ============================================
// TIPOS DE EVENTOS - MotoEvents Calendar
// ============================================

export type EventStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export type EventType = 
  | 'concentracion' 
  | 'ruta' 
  | 'competicion' 
  | 'feria' 
  | 'taller' 
  | 'quedada' 
  | 'benefico' 
  | 'otro';

export type MotorcycleType = 
  | 'custom' 
  | 'trail' 
  | 'sport' 
  | 'vintage' 
  | 'naked' 
  | 'scooter' 
  | 'todas';

export interface EventLocation {
  name: string;
  address?: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface EventOrganizer {
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  short_description: string;
  
  // Fechas
  start_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  
  // Ubicación
  location: EventLocation;
  
  // Organizador
  organizer: EventOrganizer;
  
  // Imágenes
  featured_image: string;
  gallery_images?: string[];
  
  // Categorización
  event_type: EventType;
  motorcycle_types: MotorcycleType[];
  tags: string[];
  
  // SEO
  meta_title?: string;
  meta_description?: string;
  
  // Estado y Moderación
  status: EventStatus;
  submitted_by?: string;
  moderated_by?: string;
  moderated_at?: string;
  rejection_reason?: string;
  
  // Métricas
  view_count: number;
  added_to_calendar_count: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// Tipo para crear un nuevo evento (sin campos generados)
export type CreateEventInput = Omit<
  Event, 
  'id' | 'slug' | 'status' | 'view_count' | 'added_to_calendar_count' | 
  'created_at' | 'updated_at' | 'moderated_by' | 'moderated_at' | 'rejection_reason'
>;

// Tipo para actualizar un evento
export type UpdateEventInput = Partial<CreateEventInput>;

// Tipo para el formulario de envío (UGC)
export interface EventSubmissionFormData {
  title: string;
  description: string;
  short_description: string;
  start_date: Date;
  end_date?: Date;
  start_time?: string;
  end_time?: string;
  location_name: string;
  location_address?: string;
  location_city: string;
  location_country: string;
  organizer_name: string;
  organizer_email?: string;
  organizer_phone?: string;
  organizer_website?: string;
  organizer_instagram?: string;
  organizer_facebook?: string;
  featured_image: File | null;
  gallery_images?: File[];
  event_type: EventType;
  motorcycle_types: MotorcycleType[];
  tags: string[];
}

// Evento formateado para FullCalendar
export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay: boolean;
  extendedProps: {
    slug: string;
    location: string;
    featured_image: string;
    event_type: EventType;
  };
}
