'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface CalendarEvent {
  id: string;
  title: string;
  start_date: string;
  end_date?: string;
  location_city: string;
  featured_image?: string;
  slug: string;
}

interface DayCell {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

export function CustomCalendar() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch events
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/eventos');
        if (!response.ok) throw new Error('Error fetching events');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    // Last day of the month
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
    let firstDayOfWeek = firstDayOfMonth.getDay();
    // Adjust for Monday start (0 = Monday, 6 = Sunday)
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    // Days from previous month
    const daysFromPrevMonth = firstDayOfWeek;
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    const days: DayCell[] = [];
    
    // Add days from previous month
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        dayNumber: prevMonthLastDay - i,
        isCurrentMonth: false,
        isToday: isSameDay(date, new Date()),
        events: getEventsForDate(date, events),
      });
    }
    
    // Add days from current month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        dayNumber: day,
        isCurrentMonth: true,
        isToday: isSameDay(date, new Date()),
        events: getEventsForDate(date, events),
      });
    }
    
    // Add days from next month to fill the grid (6 rows x 7 columns = 42 cells)
    const remainingCells = 42 - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        dayNumber: day,
        isCurrentMonth: false,
        isToday: isSameDay(date, new Date()),
        events: getEventsForDate(date, events),
      });
    }
    
    return days;
  }, [currentDate, events]);

  // Helper function to check if two dates are the same day
  function isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  // Helper function to format date as YYYY-MM-DD in local timezone
  function formatDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Helper function to get events for a specific date
  function getEventsForDate(date: Date, allEvents: CalendarEvent[]): CalendarEvent[] {
    const dateStr = formatDateLocal(date);
    return allEvents.filter(event => {
      const eventStart = event.start_date;
      const eventEnd = event.end_date || eventStart;
      return dateStr >= eventStart && dateStr <= eventEnd;
    });
  }

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Format month/year for header
  const monthYearLabel = currentDate.toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  });

  // Handle event click
  const handleEventClick = (slug: string) => {
    router.push(`/eventos/${slug}`);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moto-orange" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Calendar Navigation Header */}
      <div className="bg-card border-b px-6 py-4 flex items-center justify-between h-[60px]">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold hidden sm:block">Calendario de Eventos</h3>
          
          {/* Navigation */}
          <div className="flex items-center gap-1">
            <button
              onClick={goToPreviousMonth}
              className="p-2 rounded-md bg-moto-orange text-white hover:bg-moto-orange-dark transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-2 rounded-md bg-moto-orange text-white hover:bg-moto-orange-dark transition-colors text-sm font-medium"
            >
              Hoy
            </button>
            <button
              onClick={goToNextMonth}
              className="p-2 rounded-md bg-moto-orange text-white hover:bg-moto-orange-dark transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xl font-bold capitalize">{monthYearLabel}</span>
          <span className="text-sm text-muted-foreground hidden md:block">
            {events.length} eventos encontrados
          </span>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
          <div
            key={day}
            className="py-3 text-center text-sm font-semibold uppercase tracking-wide bg-muted/30"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid - Ocupa todo el espacio disponible */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6" style={{ height: 'calc(100vh - 60px)' }}>
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={cn(
              "border-r border-b relative overflow-hidden",
              !day.isCurrentMonth && "bg-muted/20",
              day.isToday && "bg-moto-orange/5"
            )}
          >
            {/* Day number */}
            <div
              className={cn(
                "absolute top-1 right-1 z-20 text-xs font-bold px-1.5 py-0.5",
                day.isToday ? "text-moto-orange" : "text-gray-600",
                day.events.length > 0 && "text-white drop-shadow-md"
              )}
              style={day.events.length > 0 ? { textShadow: '0 1px 3px rgba(0,0,0,0.8)' } : undefined}
            >
              {day.dayNumber}
            </div>

            {/* Events container */}
            <div className="absolute inset-0 pt-6 flex flex-col gap-1 p-1">
              {day.events.map((event) => (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event.slug)}
                  className={cn(
                    "flex-1 min-h-0 rounded-md overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] relative",
                    !event.featured_image && "bg-gradient-to-br from-orange-500 to-orange-600"
                  )}
                  style={event.featured_image ? {
                    backgroundImage: `url(${event.featured_image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  } : undefined}
                >
                  {/* Gradient overlay */}
                  <div 
                    className="absolute inset-0 flex flex-col justify-end p-2"
                    style={{
                      background: event.featured_image
                        ? 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)'
                        : 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 100%)'
                    }}
                  >
                    <h4 className="font-bold text-xs text-white leading-tight line-clamp-2 drop-shadow-lg">
                      {event.title}
                    </h4>
                    <div className="flex items-center gap-1 mt-0.5 text-[10px] text-white/90">
                      <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                      <span className="line-clamp-1">{event.location_city}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
