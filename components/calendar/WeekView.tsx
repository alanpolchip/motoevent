'use client';

import { useMemo, useEffect } from 'react';
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

interface WeekViewProps {
  events: CalendarEvent[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

interface DayCell {
  date: Date;
  dayNumber: number;
  monthName: string;
  isToday: boolean;
  events: CalendarEvent[];
}

export function WeekView({ events, currentDate, onDateChange }: WeekViewProps) {
  const router = useRouter();

  // Scroll navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 50) {
        e.preventDefault();
        const newDate = new Date(currentDate);
        if (e.deltaY > 0) {
          newDate.setDate(newDate.getDate() + 7);
        } else {
          newDate.setDate(newDate.getDate() - 7);
        }
        onDateChange(newDate);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentDate, onDateChange]);

  // Generate 1 week (7 days) starting from Monday
  const calendarDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    startOfWeek.setDate(startOfWeek.getDate() + diff);

    const days: DayCell[] = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      days.push({
        date,
        dayNumber: date.getDate(),
        monthName: date.toLocaleDateString('es-ES', { month: 'short' }),
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

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    onDateChange(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const weekRange = `${calendarDays[0].dayNumber} ${calendarDays[0].monthName} - ${calendarDays[6].dayNumber} ${calendarDays[6].monthName} ${currentDate.getFullYear()}`;

  const handleEventClick = (slug: string) => {
    router.push(`/eventos/${slug}`);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Calendar Navigation Header */}
      <div className="bg-card border-b px-6 py-4 flex items-center justify-between h-[60px]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button
              onClick={goToPreviousWeek}
              className="p-2 rounded-md bg-moto-orange text-white hover:bg-moto-orange-dark transition-colors"
              title="Semana anterior"
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
              onClick={goToNextWeek}
              className="p-2 rounded-md bg-moto-orange text-white hover:bg-moto-orange-dark transition-colors"
              title="Semana siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xl font-bold">{weekRange}</span>
          <span className="text-sm text-muted-foreground hidden md:block">
            {events.length} eventos
          </span>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b bg-muted/30">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, index) => (
          <div
            key={day}
            className="py-3 text-center border-r last:border-r-0"
          >
            <div className="text-sm font-semibold uppercase tracking-wide">{day}</div>
            <div className={cn(
              "text-lg font-bold mt-1",
              calendarDays[index].isToday && "text-moto-orange"
            )}>
              {calendarDays[index].dayNumber}
            </div>
          </div>
        ))}
      </div>

      {/* Calendar grid - 1 row, 7 columns - MAXIMUM HEIGHT */}
      <div 
        className="flex-1 grid grid-cols-7"
        style={{ height: 'calc(100vh - 130px)' }}
      >
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={cn(
              "border-r last:border-r-0 relative overflow-hidden",
              day.isToday && "ring-2 ring-moto-orange ring-inset"
            )}
          >
            {/* Events container */}
            {day.events.length === 0 ? (
              // Empty day
              <div className="w-full h-full bg-muted/5" />
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
                {/* Gradient overlay mejorado */}
                <div 
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 70%, transparent 100%)'
                  }}
                />
                
                {/* Event info con mejor diseño */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                  <h4 className="font-bold text-base line-clamp-3 leading-tight mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {day.events[0].title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-sm">
                    <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="line-clamp-1 font-medium">{day.events[0].location_city}</span>
                    </div>
                  </div>
                </div>

                {/* Hover effect mejorado */}
                <div className="absolute inset-0 bg-moto-orange/0 group-hover:bg-moto-orange/10 transition-all duration-300" />
                <div className="absolute inset-0 ring-0 group-hover:ring-2 group-hover:ring-moto-orange/50 ring-inset transition-all duration-300" />
              </div>
            ) : (
              // Multiple events - Stack vertically with scroll
              <div className="w-full h-full overflow-y-auto">
                {day.events.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => handleEventClick(event.slug)}
                    className="h-[33.333%] min-h-[150px] cursor-pointer relative group overflow-hidden border-b last:border-b-0"
                    style={event.featured_image ? {
                      backgroundImage: `url(${event.featured_image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    } : {
                      background: 'linear-gradient(135deg, #FF6B00 0%, #E55A00 100%)',
                    }}
                  >
                    {/* Gradient overlay mejorado */}
                    <div 
                      className="absolute inset-0 transition-opacity duration-300"
                      style={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.3) 80%, transparent 100%)'
                      }}
                    />
                    
                    {/* Event info mejorada */}
                    <div className="absolute inset-0 flex flex-col justify-end p-3 text-white">
                      <h4 className="font-bold text-sm line-clamp-2 leading-tight mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-1 text-xs">
                        <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="line-clamp-1 font-medium">{event.location_city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Hover effect mejorado */}
                    <div className="absolute inset-0 bg-moto-orange/0 group-hover:bg-moto-orange/20 transition-all duration-300" />
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
