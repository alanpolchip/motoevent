// @ts-nocheck
'use client';

import { useMemo, useEffect, useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, MapPin, CalendarDays, Clock, Menu } from 'lucide-react';
import { useSwipePanel } from '@/hooks/useSwipePanel';

interface CalendarEvent {
  id: string;
  title: string;
  start_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  location_name?: string;
  location_city: string;
  location_country?: string;
  event_type?: string;
  featured_image?: string;
  short_description?: string;
  description?: string;
  slug: string;
}

interface DayViewProps {
  events: CalendarEvent[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onMenuToggle?: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate();
}

function formatDateLocal(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getEventsForDate(date: Date, allEvents: CalendarEvent[]): CalendarEvent[] {
  const d = formatDateLocal(date);
  return allEvents.filter(e => {
    const start = e.start_date;
    const end   = e.end_date || start;
    return d >= start && d <= end;
  });
}

/**
 * Find the nearest day in direction `dir` that has at least one event.
 * Looks up to `maxLook` days ahead. Falls back to dir×1 if nothing found.
 */
function findDayWithEvents(from: Date, dir: 1 | -1, events: CalendarEvent[], maxLook = 90): Date {
  for (let i = 1; i <= maxLook; i++) {
    const d = addDays(from, dir * i);
    if (getEventsForDate(d, events).length > 0) return d;
  }
  return addDays(from, dir); // fallback
}

// ─── DayCard ──────────────────────────────────────────────────────────────────

function DayCard({
  date,
  events,
}: {
  date: Date;
  events: CalendarEvent[];
}) {
  const router = useRouter();
  const n = events.length;

  if (n === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-muted-foreground p-8">
        <CalendarDays className="w-16 h-16 opacity-20" />
        <p className="text-lg font-medium">Sin eventos</p>
        <p className="text-sm opacity-60 text-center">
          {date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <p className="text-xs opacity-40">Desliza para ver otros días</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-3 flex flex-col gap-3 overflow-hidden">
      {events.map((ev) => (
        <div
          key={ev.id}
          onClick={() => router.push(`/eventos/${ev.slug}`)}
          className="group relative rounded-xl overflow-hidden cursor-pointer flex-1 min-h-0 flex flex-col"
        >
          {/* ── Background image ──────────────────────────────────────────── */}
          {ev.featured_image ? (
            <img
              src={ev.featured_image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,#FF6B00,#E55A00)' }} />
          )}

          {/* Scrim: dark at top (legibility), fades to transparent in middle */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.15) 65%, rgba(0,0,0,0.0) 100%)',
          }} />

          {/*
            ── INFO BLOCK — todo junto en la parte superior ──────────────────
            Orden: badge → título → ubicación → fecha/hora → descripción
          */}
          <div className="relative z-10 p-4 flex flex-col gap-2 flex-1 overflow-hidden">

            {/* Badge de tipo */}
            {ev.event_type && (
              <span className="self-start px-2.5 py-0.5 text-xs font-bold bg-moto-orange text-white rounded-full tracking-wide uppercase">
                {ev.event_type}
              </span>
            )}

            {/* Título */}
            <h3 className="font-extrabold text-white text-xl md:text-2xl leading-tight line-clamp-2">
              {ev.title}
            </h3>

            {/* Ubicación */}
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-moto-orange flex-shrink-0" />
              <span className="text-white/90 text-sm font-medium">
                {ev.location_name ? `${ev.location_name}, ` : ''}{ev.location_city}
                {ev.location_country && ev.location_country !== 'España' ? `, ${ev.location_country}` : ''}
              </span>
            </div>

            {/* Fecha y hora */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <div className="flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-moto-orange flex-shrink-0" />
                <span className="text-white/85 text-sm">
                  {new Date(ev.start_date + 'T12:00:00').toLocaleDateString('es-ES', {
                    weekday: 'short', day: 'numeric', month: 'long',
                  })}
                  {ev.end_date && ev.end_date !== ev.start_date && (
                    <> — {new Date(ev.end_date + 'T12:00:00').toLocaleDateString('es-ES', {
                      day: 'numeric', month: 'long',
                    })}</>
                  )}
                </span>
              </div>
              {ev.start_time && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-moto-orange flex-shrink-0" />
                  <span className="text-white/85 text-sm">
                    {ev.start_time.slice(0, 5)}
                    {ev.end_time ? ` – ${ev.end_time.slice(0, 5)}` : ''}
                  </span>
                </div>
              )}
            </div>

            {/* Separador */}
            <div className="w-12 h-px bg-moto-orange/60 my-0.5" />

            {/* Descripción corta */}
            {ev.short_description && (
              <p className="text-white/90 text-sm font-medium leading-snug line-clamp-2">
                {ev.short_description}
              </p>
            )}

            {/* Descripción larga (solo si hay espacio — flex con overflow hidden) */}
            {ev.description && (
              <p className="text-white/65 text-sm leading-relaxed line-clamp-3 mt-0.5">
                {ev.description}
              </p>
            )}
          </div>

          {/* Hover ring */}
          <div className="absolute inset-0 ring-0 group-hover:ring-2 group-hover:ring-moto-orange/60 ring-inset rounded-xl transition-all duration-300" />
        </div>
      ))}
    </div>
  );
}

// ─── DayView ──────────────────────────────────────────────────────────────────

export function DayView({ events, currentDate, onDateChange, onMenuToggle }: DayViewProps) {
  const today = new Date();

  // ── Compute prev / next day (skipping empty days) ──────────────────────────
  const prevDay = useMemo(
    () => findDayWithEvents(currentDate, -1, events),
    [currentDate, events],
  );
  const nextDay = useMemo(
    () => findDayWithEvents(currentDate, 1, events),
    [currentDate, events],
  );
  const currentDayEvents = useMemo(
    () => getEventsForDate(currentDate, events),
    [currentDate, events],
  );

  // ── Swipe panel hook ───────────────────────────────────────────────────────
  const { trackRef, handlers, wheelHandler, resetPosition } = useSwipePanel({
    onNext: () => onDateChange(nextDay),
    onPrev: () => onDateChange(prevDay),
  });

  // Container ref for wheel listener attachment
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => { resetPosition(); }, [currentDate]); // eslint-disable-line

  // Reset when container resizes (sidebar toggle → paddingLeft CSS transition)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => resetPosition());
    ro.observe(el);
    return () => ro.disconnect();
  }, [resetPosition]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', wheelHandler, { passive: false });
    return () => el.removeEventListener('wheel', wheelHandler);
  }, [wheelHandler]);

  // ── Header label ───────────────────────────────────────────────────────────
  const dateLabel = currentDate.toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  const isToday = isSameDay(currentDate, today);

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* ── Navigation header ─────────────────────────────────────────────── */}
      <div className="bg-card border-b px-4 flex items-center justify-between h-[60px] flex-shrink-0 gap-2">
        <div className="flex items-center gap-2">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              aria-label="Menú"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onDateChange(prevDay)}
              className="p-2 rounded-md bg-moto-orange text-white hover:bg-moto-orange-dark transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDateChange(new Date())}
              className="px-3 py-2 rounded-md bg-moto-orange text-white hover:bg-moto-orange-dark transition-colors text-sm font-medium"
            >
              Hoy
            </button>
            <button
              onClick={() => onDateChange(nextDay)}
              className="p-2 rounded-md bg-moto-orange text-white hover:bg-moto-orange-dark transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <span className={`text-sm md:text-base font-semibold capitalize truncate max-w-[200px] md:max-w-xs ${isToday ? 'text-moto-orange' : ''}`}>
          {dateLabel}
        </span>
      </div>

      {/*
        ── 3-panel sliding strip ────────────────────────────────────────────
        Container: overflow:hidden — the visible viewport
        Track:     width:300%, 3 panels side by side
                   translateX(-100% of container) → middle panel visible
                   CSS transition only fires on swipe commit
      */}
      <div
        ref={containerRef}
        style={{ flex: 1, overflow: 'hidden', position: 'relative' }}
        {...handlers}
      >
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            width: '300%',
            height: '100%',
            willChange: 'transform',
          }}
        >
          {/* Panel: prev day */}
          <div style={{ width: 'calc(100%/3)', height: '100%', flexShrink: 0 }}>
            <DayCard date={prevDay} events={getEventsForDate(prevDay, events)} />
          </div>

          {/* Panel: current day */}
          <div
            style={{ width: 'calc(100%/3)', height: '100%', flexShrink: 0 }}
            className={isToday ? 'bg-moto-orange/5' : ''}
          >
            <DayCard date={currentDate} events={currentDayEvents} />
          </div>

          {/* Panel: next day */}
          <div style={{ width: 'calc(100%/3)', height: '100%', flexShrink: 0 }}>
            <DayCard date={nextDay} events={getEventsForDate(nextDay, events)} />
          </div>
        </div>
      </div>
    </div>
  );
}
