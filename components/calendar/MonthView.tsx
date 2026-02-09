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

interface MonthViewProps {
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

export function MonthView({ events, currentDate, onDateChange }: MonthViewProps) {
  const router = useRouter();

  // Generate calendar grid (4-5 weeks to cover full month)
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    let firstDayOfWeek = firstDayOfMonth.getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    const daysFromPrevMonth = firstDayOfWeek;
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    const days: DayCell[] = [];
    
    // Days from previous month
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
    
    // Days from current month
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
    
    // Days from next month (fill to 35 cells = 5 rows)
    const remainingCells = 35 - days.length;
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

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onDateChange(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
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
          <div className="flex items-center gap-1">
            <button
              onClick={goToPreviousMonth}
              className="p-2 rounded-md bg-moto-orange text-white hover:bg-moto-orange-dark transition-colors"
              title="Mes anterior"
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
              title="Mes siguiente"
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
            className="py-2 text-center text-xs font-semibold uppercase tracking-wide"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid - 5 rows of 7 columns */}
      <div 
        className="flex-1 grid grid-cols-7 grid-rows-5"
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
                <div
                  className={cn(
                    "absolute top-1 right-1 z-20 text-xs font-bold px-1.5 py-0.5 rounded",
                    day.isToday 
                      ? "bg-moto-orange text-white" 
                      : day.isCurrentMonth
                        ? "text-foreground"
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
                    "absolute top-1 right-1 z-30 text-xs font-bold px-1.5 py-0.5 rounded shadow-lg",
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
                <div className="absolute inset-0 flex flex-col justify-end p-2 text-white">
                  <h4 className="font-bold text-xs line-clamp-2 drop-shadow-lg mb-0.5">
                    {day.events[0].title}
                  </h4>
                  <div className="flex items-center gap-0.5 text-[10px] opacity-90">
                    <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                    <span className="line-clamp-1">{day.events[0].location_city}</span>
                  </div>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
            ) : (
              // Multiple events - Split columns (max 3 shown)
              <div className="w-full h-full flex relative">
                {/* Day number on top of multiple events */}
                <div
                  className={cn(
                    "absolute top-1 right-1 z-30 text-xs font-bold px-1.5 py-0.5 rounded shadow-lg",
                    day.isToday 
                      ? "bg-moto-orange text-white" 
                      : "bg-white/90 text-gray-700"
                  )}
                >
                  {day.dayNumber}
                </div>

                {day.events.slice(0, 3).map((event) => (
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
                    
                    {/* Event title only (vertical text for narrow columns) */}
                    <div className="absolute inset-0 flex items-end p-1">
                      <h4 className="font-bold text-[10px] text-white line-clamp-4 drop-shadow-lg">
                        {event.title}
                      </h4>
                    </div>

                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                ))}
                {/* Show "+X more" indicator if more than 3 events */}
                {day.events.length > 3 && (
                  <div className="absolute bottom-1 left-1 bg-moto-orange text-white text-[9px] font-bold px-1 py-0.5 rounded z-20">
                    +{day.events.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
