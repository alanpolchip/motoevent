'use client';

import { useMemo, useEffect, useLayoutEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, MapPin, Menu } from 'lucide-react';
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
  onMenuToggle?: () => void;
}

interface DayCell {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

export function BiweeklyView({ events, currentDate, onDateChange, onMenuToggle }: BiweeklyViewProps) {
  const router = useRouter();

  // ── Seamless slide transition ──────────────────────────────────────────
  // Mantenemos la fecha "mostrada" internamente.
  // Cuando currentDate cambia, renderizamos AMBAS grids en paralelo:
  //   - outgoing: 0 → ±100%
  //   - incoming: ∓100% → 0
  // Sin gap, sin flash, totalmente seamless.
  const [displayedDate, setDisplayedDate] = useState(currentDate);
  const [pendingDate, setPendingDate]     = useState<Date | null>(null);
  const [direction, setDirection]         = useState<'next' | 'prev' | null>(null);
  // 'idle'  → solo grid activo
  // 'ready' → ambas grids renderizadas en posición inicial (sin transition aún)
  // 'sliding' → transition activa en ambas
  const [phase, setPhase] = useState<'idle' | 'ready' | 'sliding'>('idle');

  // Detectar cambio en currentDate prop → iniciar animación
  useEffect(() => {
    if (pendingDate) return; // ya hay una animación en curso
    if (currentDate.getTime() === displayedDate.getTime()) return;

    const dir = currentDate > displayedDate ? 'next' : 'prev';
    setDirection(dir);
    setPendingDate(currentDate);
    setPhase('ready'); // primer render: grids en posición inicial sin transición
  }, [currentDate]);

  // Tras 'ready' (DOM pintado), activar transición en el siguiente frame
  useLayoutEffect(() => {
    if (phase === 'ready') {
      requestAnimationFrame(() => setPhase('sliding'));
    }
  }, [phase]);

  // Transición terminada → limpiar
  const handleTransitionEnd = () => {
    if (phase !== 'sliding') return;
    setDisplayedDate(pendingDate!);
    setPendingDate(null);
    setDirection(null);
    setPhase('idle');
  };

  // Navegar usando displayedDate (no el prop, que puede ir adelantado)
  const doNavigate = (dir: 'next' | 'prev') => {
    if (phase !== 'idle') return;
    const newDate = new Date(displayedDate);
    newDate.setDate(newDate.getDate() + (dir === 'next' ? 14 : -14));
    onDateChange(newDate);
  };

  // Wheel con acumulador para evitar disparos múltiples
  const scrollAccum = useRef(0);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      scrollAccum.current += e.deltaY;
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => {
        if (Math.abs(scrollAccum.current) > 80) {
          doNavigate(scrollAccum.current > 0 ? 'next' : 'prev');
        }
        scrollAccum.current = 0;
      }, 50);
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, [displayedDate, phase]);

  // ── Transforms ──────────────────────────────────────────────────────────
  const TRANSITION = 'transform 320ms cubic-bezier(0.4, 0, 0.2, 1)';

  const outgoingStyle: React.CSSProperties = {
    position: 'absolute', inset: 0,
    transform: phase === 'sliding'
      ? `translateX(${direction === 'next' ? '-100%' : '100%'})`
      : 'translateX(0)',
    transition: phase === 'sliding' ? TRANSITION : 'none',
    willChange: 'transform',
  };

  const incomingStyle: React.CSSProperties = {
    position: 'absolute', inset: 0,
    transform: phase === 'sliding'
      ? 'translateX(0)'
      : `translateX(${direction === 'next' ? '100%' : '-100%'})`,
    transition: phase === 'sliding' ? TRANSITION : 'none',
    willChange: 'transform',
  };
  // ────────────────────────────────────────────────────────────────────────

  // Generate 14 days for any given date
  const computeDays = (date: Date): DayCell[] => {
    const start = new Date(date);
    const dow = start.getDay();
    start.setDate(start.getDate() + (dow === 0 ? -6 : 1 - dow));
    const days: DayCell[] = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push({
        date: d,
        dayNumber: d.getDate(),
        isCurrentMonth: d.getMonth() === date.getMonth(),
        isToday: isSameDay(d, new Date()),
        events: getEventsForDate(d, events),
      });
    }
    return days;
  };

  const displayedDays = useMemo(() => computeDays(displayedDate), [displayedDate, events]);
  const pendingDays   = useMemo(() => pendingDate ? computeDays(pendingDate) : [], [pendingDate, events]);

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

  const goToPreviousWeeks = () => doNavigate('prev');
  const goToNextWeeks    = () => doNavigate('next');
  const goToToday        = () => { if (phase === 'idle') onDateChange(new Date()); };

  // ── Touch swipe support ──────────────────────────────────────────────────
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Only trigger if horizontal movement dominates and is significant
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    if (dx < 0) doNavigate('next');
    else        doNavigate('prev');
  };

  const monthYearLabel = displayedDate.toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  });

  const handleEventClick = (slug: string) => {
    router.push(`/eventos/${slug}`);
  };

  return (
    <div className="h-screen flex flex-col" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {/* Calendar Navigation Header */}
      <div className="bg-card border-b px-4 md:px-6 py-4 flex items-center justify-between h-[60px]">
        <div className="flex items-center gap-2 md:gap-4">
          {onMenuToggle && (
            <button onClick={onMenuToggle} className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted hover:bg-muted/80 transition-colors" aria-label="Menú">
              <Menu className="w-5 h-5" />
            </button>
          )}
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

      {/* Calendar grid — contenedor con overflow hidden para el slide */}
      <div className="flex-1 relative overflow-hidden" style={{ height: 'calc(100vh - 110px)' }}>

        {/* Grid saliente (displayedDate) */}
        <div
          className="grid grid-cols-7 grid-rows-2 w-full h-full"
          style={outgoingStyle}
          onTransitionEnd={handleTransitionEnd}
        >
        {displayedDays.map((day, index) => (
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

                {/* Gradient overlay mejorado */}
                <div 
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 70%, transparent 100%)'
                  }}
                />
                
                {/* Event info con mejor jerarquía visual */}
                <div className="absolute inset-0 flex flex-col justify-end p-3 text-white">
                  <h4 className="font-bold text-sm line-clamp-2 leading-tight mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {day.events[0].title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs">
                    <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="line-clamp-1 font-medium">{day.events[0].location_city}</span>
                    </div>
                  </div>
                </div>

                {/* Hover effect mejorado con escala */}
                <div className="absolute inset-0 bg-moto-orange/0 group-hover:bg-moto-orange/10 transition-all duration-300" />
                <div className="absolute inset-0 ring-0 group-hover:ring-2 group-hover:ring-moto-orange/50 ring-inset transition-all duration-300 rounded-sm" />
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
                    {/* Gradient overlay mejorado */}
                    <div 
                      className="absolute inset-0 transition-opacity duration-300"
                      style={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.3) 80%, transparent 100%)'
                      }}
                    />
                    
                    {/* Event title con mejor contraste */}
                    <div className="absolute inset-0 flex items-end p-2">
                      <h4 className="font-bold text-xs text-white line-clamp-3 leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {event.title}
                      </h4>
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

        {/* Grid entrante (pendingDate) — solo cuando hay animación */}
        {pendingDate && (
          <div
            className="grid grid-cols-7 grid-rows-2 w-full h-full"
            style={incomingStyle}
          >
          {pendingDays.map((day, index) => (
            <div
              key={index}
              className={cn(
                "border-r border-b relative overflow-hidden",
                !day.isCurrentMonth && "bg-muted/10",
                day.isToday && "ring-2 ring-moto-orange ring-inset"
              )}
            >
              {day.events.length === 0 ? (
                <>
                  <div className={cn(
                    "absolute top-2 right-2 z-20 text-sm font-bold px-2 py-1 rounded",
                    day.isToday ? "bg-moto-orange text-white" : "text-muted-foreground"
                  )}>
                    {day.dayNumber}
                  </div>
                  <div className="w-full h-full" />
                </>
              ) : day.events.length === 1 ? (
                <div
                  onClick={() => handleEventClick(day.events[0].slug)}
                  className="w-full h-full cursor-pointer relative group overflow-hidden"
                  style={day.events[0].featured_image ? {
                    backgroundImage: `url(${day.events[0].featured_image})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                  } : { background: 'linear-gradient(135deg, #FF6B00 0%, #E55A00 100%)' }}
                >
                  <div className={cn(
                    "absolute top-2 right-2 z-30 text-sm font-bold px-2 py-1 rounded shadow-lg",
                    day.isToday ? "bg-moto-orange text-white" : "bg-white/90 text-gray-700"
                  )}>{day.dayNumber}</div>
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 70%, transparent 100%)' }} />
                  <div className="absolute inset-0 flex flex-col justify-end p-3 text-white">
                    <h4 className="font-bold text-sm line-clamp-2 leading-tight mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{day.events[0].title}</h4>
                    <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full w-fit">
                      <MapPin className="w-3 h-3 flex-shrink-0 text-white" />
                      <span className="text-xs line-clamp-1 font-medium text-white">{day.events[0].location_city}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex relative">
                  <div className={cn(
                    "absolute top-2 right-2 z-30 text-sm font-bold px-2 py-1 rounded shadow-lg",
                    day.isToday ? "bg-moto-orange text-white" : "bg-white/90 text-gray-700"
                  )}>{day.dayNumber}</div>
                  {day.events.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => handleEventClick(event.slug)}
                      className="flex-1 cursor-pointer relative group overflow-hidden border-r last:border-r-0"
                      style={event.featured_image ? {
                        backgroundImage: `url(${event.featured_image})`,
                        backgroundSize: 'cover', backgroundPosition: 'center',
                      } : { background: 'linear-gradient(135deg, #FF6B00 0%, #E55A00 100%)' }}
                    >
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.3) 80%, transparent 100%)' }} />
                      <div className="absolute inset-0 flex items-end p-2">
                        <h4 className="font-bold text-xs text-white line-clamp-3 leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{event.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}
