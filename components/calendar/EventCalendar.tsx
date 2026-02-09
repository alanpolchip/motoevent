'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { useRouter } from 'next/navigation';
import { CalendarEvent } from '@/types/event';
import { cn } from '@/lib/utils/cn';
import { MapPin } from 'lucide-react';

// Tipo para la vista del calendario
type CalendarView = 'dayGridMonth' | 'timeGridWeek';

export function EventCalendar() {
  const router = useRouter();
  const calendarRef = useRef<FullCalendar>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<CalendarView>('dayGridMonth');

  // Fetch de eventos
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/eventos');
        if (!response.ok) throw new Error('Error fetching events');
        const data = await response.json();
        
        // Transformar eventos de la API al formato de FullCalendar
        const calendarEvents = data.map((event: any) => ({
          id: event.id,
          title: event.title,
          start: event.end_date
            ? `${event.start_date}T00:00:00`  // Multi-day event
            : `${event.start_date}${event.start_time ? 'T' + event.start_time : 'T00:00:00'}`,
          end: event.end_date
            ? `${event.end_date}T23:59:59`  // End of last day
            : event.start_time
              ? `${event.start_date}T${event.end_time || '23:59:59'}`
              : undefined,
          allDay: !event.start_time && !event.end_date,
          extendedProps: {
            slug: event.slug,
            location: event.location_city,
            featured_image: event.featured_image,
            event_type: event.event_type,
          },
        }));
        
        setEvents(calendarEvents);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // Cambiar vista del calendario
  const handleViewChange = useCallback((newView: CalendarView) => {
    setView(newView);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(newView);
    }
  }, []);

  // Navegar al detalle del evento
  const handleEventClick = useCallback((info: any) => {
    const slug = info.event.extendedProps.slug;
    router.push(`/eventos/${slug}`);
  }, [router]);

  // Render personalizado del contenido del evento
  const renderEventContent = (eventInfo: any) => {
    const { extendedProps } = eventInfo.event;
    const hasImage = extendedProps.featured_image;

    return (
      <div
        className={cn(
          "relative w-full h-full min-h-[80px] overflow-hidden rounded-md cursor-pointer transition-transform hover:scale-[1.02]",
          hasImage && "event-with-image"
        )}
        style={hasImage ? {
          backgroundImage: `url(${extendedProps.featured_image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : {
          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        }}
      >
        {/* Overlay con información */}
        <div className={cn(
          "absolute inset-0 flex flex-col justify-end p-3",
          hasImage && "bg-gradient-to-t from-black/80 via-black/40 to-transparent"
        )}>
          <h4 className={cn(
            "font-bold text-sm leading-tight line-clamp-2",
            "text-white drop-shadow-lg"
          )}>
            {eventInfo.event.title}
          </h4>
          <div className={cn(
            "flex items-center gap-1 mt-1 text-xs",
            "text-white/90"
          )}>
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="line-clamp-1">{extendedProps.location}</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-180px)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moto-orange" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header del calendario con controles */}
      <div className="bg-card border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold hidden sm:block">Calendario de Eventos</h3>
          
          {/* Toggle de vistas */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => handleViewChange('dayGridMonth')}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                view === 'dayGridMonth' 
                  ? "bg-moto-orange text-white shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-background"
              )}
            >
              Mensual
            </button>
            <button
              onClick={() => handleViewChange('timeGridWeek')}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                view === 'timeGridWeek' 
                  ? "bg-moto-orange text-white shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-background"
              )}
            >
              Semanal
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden md:block">
            {events.length} eventos encontrados
          </span>
          <span className="text-xs text-muted-foreground hidden lg:block">
            Haz clic en un evento para ver más detalles
          </span>
        </div>
      </div>

      {/* Calendario - Ocupa todo el espacio disponible */}
      <div className="flex-1 calendar-wrapper fc-theme-standard">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={view}
          locale={esLocale}
          events={events}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: ''
          }}
          buttonText={{
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
          }}
          height="100%"
          dayMaxEvents={4}
          moreLinkText="+{count} más"
          eventDisplay="block"
          eventOverlap={false}
          allDaySlot={true}
          allDayText="Todo el día"
          dayHeaderFormat={{ weekday: 'short', day: 'numeric' }}
          titleFormat={{ year: 'numeric', month: 'long' }}
          firstDay={1}
          fixedWeekCount={false}
          showNonCurrentDates={false}
          displayEventTime={false}
        />
      </div>
    </div>
  );
}
