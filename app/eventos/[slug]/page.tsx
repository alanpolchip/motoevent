import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Clock, Users } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';

interface EventPageProps {
  params: {
    slug: string;
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const supabase = createAdminClient();

  // Fetch event by slug
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'approved')
    .single();

  if (error || !event) {
    notFound();
  }

  // Format dates
  const startDate = new Date(event.start_date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const endDate = event.end_date
    ? new Date(event.end_date).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al calendario
          </Link>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${event.featured_image})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        
        {/* Event Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container">
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              {event.title}
            </h1>
            <p className="text-lg text-white/90 max-w-2xl">
              {event.short_description}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-card border rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Descripción</h2>
              <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Date Info */}
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-moto-orange" />
                Fecha
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Inicio</p>
                  <p className="font-medium capitalize">{startDate}</p>
                  {event.start_time && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {event.start_time}
                    </p>
                  )}
                </div>
                {endDate && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">Fin</p>
                    <p className="font-medium capitalize">{endDate}</p>
                    {event.end_time && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {event.end_time}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-moto-orange" />
                Ubicación
              </h3>
              <div className="space-y-1">
                <p className="font-medium">{event.location_name}</p>
                {event.location_address && (
                  <p className="text-sm text-muted-foreground">{event.location_address}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  {event.location_city}, {event.location_country}
                </p>
              </div>
            </div>

            {/* Organizer */}
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-moto-orange" />
                Organizador
              </h3>
              <p className="font-medium">{event.organizer_name}</p>
              {event.organizer_email && (
                <a
                  href={`mailto:${event.organizer_email}`}
                  className="text-sm text-moto-orange hover:underline mt-2 block"
                >
                  {event.organizer_email}
                </a>
              )}
              {event.organizer_phone && (
                <p className="text-sm text-muted-foreground mt-1">{event.organizer_phone}</p>
              )}
            </div>

            {/* Event Type */}
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4">Tipo de Evento</h3>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-moto-orange/10 text-moto-orange text-sm font-medium capitalize">
                  {event.event_type}
                </span>
              </div>
            </div>

            {/* Motorcycle Types */}
            {event.motorcycle_types && event.motorcycle_types.length > 0 && (
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4">Motos Recomendadas</h3>
                <div className="flex flex-wrap gap-2">
                  {event.motorcycle_types.map((type) => (
                    <span
                      key={type}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-sm capitalize"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
