'use client';

import { useMemo } from 'react';
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

interface BiweeklyViewProps {
  events: CalendarEvent[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

interface DayCell {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

export function BiweeklyView({ events, currentDate, onDateChange }: BiweeklyViewProps) {
  const router = useRouter();

  // Generate 2 weeks (14 days) starting from Monday of current week
  const calendarDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Adjust to Monday
    startOfWeek.setDate(startOfWeek.getDate() + diff);

    const days: DayCell[] = [];
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      days.push({
        date,
        dayNumber: date.getDate(),
        isCurrentMonth: date.getMonth() === currentDate.getMonth(),
        isToday: isSameDay(date, new Date()),
        events: getEventsForDate(date, events),
      });
    }
    
    return days;
  }, [currentDate, events]);

  function isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  function formatDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function getEventsForDate(date: Date, allEvents: CalendarEvent[]): CalendarEvent[] {
    const dateStr = formatDateLocal(date);
    return allEvents.filter(event => {
      const eventStart = event.start_date;
      const eventEnd = event.end_date || eventStart;
      return dateStr >= eventStart && dateStr <= eventEnd;
    });
  }

  const goToPreviousWeeks = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 14);
    onDateChange(newDate);
  };

  const goToNextWeeks = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 14);
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const monthYearLabel = currentDate.toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  });

  const handleEventClick = (slug: string) => {
    router.push(`/eventos/${slug}`);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Calendar Navigation Header */}
      <div className="bg-card border-b px-6 py-4 flex items-center justify-between h-[60px]">
        <div className="flex items-center gap-4">
          {/* Navigation */}
          <div className="flex items-center gap-1">
            <button
              onClick={goToPreviousWeeks}
              className="p-2 rounded-md bg-moto-orange text-white hover:bg-moto-orange-dark transition-colors"
              title="2 semanas anteriores"
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
              onClick={goToNextWeeks}
              className="p-2 rounded-md bg-moto-orange text-white hover:bg-moto-orange-dark transition-colors"
              title="2 semanas siguientes"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xl font-bold capitalize">{monthYearLabel}</span>
          <span className="text-sm text-muted-foreground hidden md:block">
            {events.length} eventos
          </span>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b bg-muted/30">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
          <div
            key={day}
            className="py-2 text-center text-sm font-semibold uppercase tracking-wide"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid - 2 rows of 7 columns */}
      <div 
        className="flex-1 grid grid-cols-7 grid-rows-2"
        style={{ height: 'calc(100vh - 110px)' }}
      >
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={cn(
              "border-r border-b relative overflow-hidden",
              !day.isCurrentMonth && "bg-muted/10",
              day.isToday && "ring-2 ring-moto-orange ring-inset"
            )}
          >
            {/* Events container */}
            {day.events.length === 0 ? (
              // Empty day
              <>
                {/* Day number for empty days */}
                <div
                  className={cn(
                    "absolute top-2 right-2 z-20 text-sm font-bold px-2 py-1 rounded",
                    day.isToday 
                      ? "bg-moto-orange text-white" 
                      : "text-muted-foreground"
                  )}
                >
                  {day.dayNumber}
                </div>
                <div className="w-full h-full" />
              </>
            ) : day.events.length === 1 ? (
              // Single event - Full image background
              <div
                onClick={() => handleEventClick(day.events[0].slug)}
                className="w-full h-full cursor-pointer relative group overflow-hidden"
                style={day.events[0].featured_image ? {
                  backgroundImage: `url(${day.events[0].featured_image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                } : {
                  background: 'linear-gradient(135deg, #FF6B00 0%, #E55A00 100%)',
                }}
              >
                {/* Day number on top of image */}
                <div
                  className={cn(
                    "absolute top-2 right-2 z-30 text-sm font-bold px-2 py-1 rounded shadow-lg",
                    day.isToday 
                      ? "bg-moto-orange text-white" 
                      : "bg-white/90 text-gray-700"
                  )}
                >
                  {day.dayNumber}
                </div>

                {/* Gradient overlay */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)'
                  }}
                />
                
                {/* Event info */}
                <div className="absolute inset-0 flex flex-col justify-end p-3 text-white">
                  <h4 className="font-bold text-sm line-clamp-2 drop-shadow-lg mb-1">
                    {day.events[0].title}
                  </h4>
                  <div className="flex items-center gap-1 text-xs opacity-90">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="line-clamp-1">{day.events[0].location_city}</span>
                  </div>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
            ) : (
              // Multiple events - Split columns (N eventos = 100% / N)
              <div className="w-full h-full flex relative">
                {/* Day number on top of multiple events */}
                <div
                  className={cn(
                    "absolute top-2 right-2 z-30 text-sm font-bold px-2 py-1 rounded shadow-lg",
                    day.isToday 
                      ? "bg-moto-orange text-white" 
                      : "bg-white/90 text-gray-700"
                  )}
                >
                  {day.dayNumber}
                </div>

                {day.events.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => handleEventClick(event.slug)}
                    className="flex-1 cursor-pointer relative group overflow-hidden border-r last:border-r-0"
                    style={event.featured_image ? {
                      backgroundImage: `url(${event.featured_image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    } : {
                      background: 'linear-gradient(135deg, #FF6B00 0%, #E55A00 100%)',
                    }}
                  >
                    {/* Gradient overlay */}
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)'
                      }}
                    />
                    
                    {/* Event title only */}
                    <div className="absolute inset-0 flex items-end p-2">
                      <h4 className="font-bold text-xs text-white line-clamp-3 drop-shadow-lg">
                        {event.title}
                      </h4>
                    </div>

                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
