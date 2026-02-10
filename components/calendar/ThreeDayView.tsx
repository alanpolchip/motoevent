// @ts-nocheck
'use client';

import { useMemo, useEffect, useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, MapPin, CalendarDays, Clock, Menu } from 'lucide-react';
import { useSwipePanel } from '@/hooks/useSwipePanel';
import { cn } from '@/lib/utils/cn';

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

interface ThreeDayViewProps {
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
    const end = e.end_date || e.start_date;
    return d >= e.start_date && d <= end;
  });
}

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// ─── 3-day panel component ────────────────────────────────────────────────────

function ThreeDayPanel({ startDate, events }: { startDate: Date; events: CalendarEvent[] }) {
  const router = useRouter();
  const today  = new Date();

  const days = Array.from({ length: 3 }, (_, i) => {
    const date = addDays(startDate, i);
    return { date, isToday: isSameDay(date, today), events: getEventsForDate(date, events) };
  });

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      {days.map(({ date, isToday, events: dayEvents }, colIdx) => (
        <div
          key={colIdx}
          style={{ flex: 1, minWidth: 0, borderRight: colIdx < 2 ? '1px solid var(--border)' : 'none', display: 'flex', flexDirection: 'column' }}
          className={cn(isToday && 'ring-2 ring-moto-orange ring-inset')}
        >
          {/* Day header — name + number inline */}
          <div className={cn(
            'flex-shrink-0 py-1.5 border-b bg-muted/30 flex items-center justify-center gap-1.5',
            isToday && 'bg-moto-orange/10',
          )}>
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {DAY_NAMES[date.getDay()]}
            </span>
            <span className={cn('text-base font-bold', isToday && 'text-moto-orange')}>
              {date.getDate()}
            </span>
          </div>

          {/* Day content */}
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            {dayEvents.length === 0 ? (
              <div className="flex-1 flex items-center justify-center bg-muted/5">
                <CalendarDays className="w-8 h-8 opacity-10" />
              </div>
            ) : (
              <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: '4px', padding: '4px', overflow: 'hidden', minHeight: 0 }}>
                {dayEvents.map((ev) => (
                  <div
                    key={ev.id}
                    onClick={() => router.push(`/eventos/${ev.slug}`)}
                    style={{ position: 'relative', flex: 1, minHeight: 0, width: '100%', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer' }}
                    className="group"
                  >
                    {/* Background — fills entire card */}
                    {ev.featured_image ? (
                      <img src={ev.featured_image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} draggable={false} />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#FF6B00,#E55A00)' }} />
                    )}

                    {/* Scrim */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.50) 45%, rgba(0,0,0,0.10) 75%, transparent 100%)' }} />

                    {/*
                      Info block — width:100% box-sizing:border-box is more
                      reliable than left+right:0 across nested flex contexts.
                    */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', boxSizing: 'border-box', zIndex: 10, padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {ev.event_type && (
                        <span style={{ alignSelf: 'flex-start', padding: '1px 6px', fontSize: '9px', fontWeight: 700, background: '#FF6B00', color: 'white', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.4 }}>
                          {ev.event_type}
                        </span>
                      )}
                      <h4 style={{ margin: 0, fontWeight: 800, color: 'white', fontSize: '12px', lineHeight: 1.25, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {ev.title}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin style={{ width: 10, height: 10, color: '#FF6B00', flexShrink: 0 }} />
                        <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '11px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {ev.location_city}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CalendarDays style={{ width: 10, height: 10, color: '#FF6B00', flexShrink: 0 }} />
                        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {new Date(ev.start_date + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                          {ev.end_date && ev.end_date !== ev.start_date && ` – ${new Date(ev.end_date + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`}
                        </span>
                      </div>
                      {ev.short_description && (
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.72)', fontSize: '10px', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {ev.short_description}
                        </p>
                      )}
                    </div>

                    <div className="absolute inset-0 ring-0 group-hover:ring-2 group-hover:ring-moto-orange/50 ring-inset rounded-lg transition-all duration-300" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── ThreeDayView ─────────────────────────────────────────────────────────────

export function ThreeDayView({ events, currentDate, onDateChange, onMenuToggle }: ThreeDayViewProps) {
  const today = new Date();

  // Each panel shows 3 days starting from startDate. Navigate by 3 days.
  const prevStart = useMemo(() => addDays(currentDate, -3), [currentDate]);
  const nextStart = useMemo(() => addDays(currentDate,  3), [currentDate]);

  const { trackRef, handlers, wheelHandler, resetPosition } = useSwipePanel({
    onNext: () => onDateChange(nextStart),
    onPrev: () => onDateChange(prevStart),
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => { resetPosition(); }, [currentDate]); // eslint-disable-line

  // Reset track when container resizes (sidebar open/close → paddingLeft transition)
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

  // ── Header label ─────────────────────────────────────────────────────────
  const endDate = addDays(currentDate, 2);
  const fmt = (d: Date) => `${d.getDate()} ${d.toLocaleDateString('es-ES', { month: 'short' })}`;
  const rangeLabel = `${fmt(currentDate)} – ${fmt(endDate)} ${endDate.getFullYear()}`;

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-card border-b px-4 flex items-center justify-between h-[60px] flex-shrink-0 gap-2">
        <div className="flex items-center gap-2">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-1">
            <button onClick={() => onDateChange(prevStart)} className="p-2 rounded-md bg-moto-orange text-white hover:bg-moto-orange-dark transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => onDateChange(new Date())} className="px-3 py-2 rounded-md bg-moto-orange text-white hover:bg-moto-orange-dark transition-colors text-sm font-medium">
              Hoy
            </button>
            <button onClick={() => onDateChange(nextStart)} className="p-2 rounded-md bg-moto-orange text-white hover:bg-moto-orange-dark transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <span className="text-sm md:text-base font-semibold truncate max-w-[200px] md:max-w-xs">
          {rangeLabel}
        </span>
      </div>

      {/* 3-panel strip */}
      <div
        ref={containerRef}
        style={{ flex: 1, overflow: 'hidden', position: 'relative' }}
        {...handlers}
      >
        <div
          ref={trackRef}
          style={{ display: 'flex', width: '300%', height: '100%', willChange: 'transform' }}
        >
          <div style={{ width: 'calc(100%/3)', height: '100%', flexShrink: 0 }}>
            <ThreeDayPanel startDate={prevStart} events={events} />
          </div>
          <div style={{ width: 'calc(100%/3)', height: '100%', flexShrink: 0 }}>
            <ThreeDayPanel startDate={currentDate} events={events} />
          </div>
          <div style={{ width: 'calc(100%/3)', height: '100%', flexShrink: 0 }}>
            <ThreeDayPanel startDate={nextStart} events={events} />
          </div>
        </div>
      </div>
    </div>
  );
}
