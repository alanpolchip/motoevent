// @ts-nocheck
'use client';

import { useMemo, useEffect, useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, MapPin, CalendarDays, Menu } from 'lucide-react';
import { useSwipePanel } from '@/hooks/useSwipePanel';
import { cn } from '@/lib/utils/cn';

interface CalendarEvent {
  id: string;
  title: string;
  start_date: string;
  end_date?: string;
  location_city: string;
  event_type?: string;
  featured_image?: string;
  slug: string;
}

interface WeekViewProps {
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

// ─── 7-day panel ─────────────────────────────────────────────────────────────
// This is one full week panel. Each swipe replaces the entire panel → zero
// per-column snap events → no number flicker, no re-render cascade.

function WeekPanel({ startDate, events }: { startDate: Date; events: CalendarEvent[] }) {
  const router = useRouter();
  const today  = new Date();

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startDate, i);
    return { date, isToday: isSameDay(date, today), events: getEventsForDate(date, events) };
  });

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      {days.map(({ date, isToday, events: dayEvents }, colIdx) => (
        <div
          key={colIdx}
          style={{
            flex: 1,
            minWidth: 0,
            borderRight: colIdx < 6 ? '1px solid var(--border)' : 'none',
            display: 'flex',
            flexDirection: 'column',
          }}
          className={cn(isToday && 'ring-2 ring-moto-orange ring-inset')}
        >
          {/* Column header — name + number in one row */}
          <div className={cn(
            'flex-shrink-0 py-1.5 border-b bg-muted/30 flex items-center justify-center gap-1',
            isToday && 'bg-moto-orange/10',
          )}>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {DAY_NAMES[date.getDay()]}
            </span>
            <span className={cn('text-sm font-bold', isToday ? 'text-moto-orange' : '')}>
              {date.getDate()}
            </span>
          </div>

          {/* Events */}
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            {dayEvents.length === 0 ? (
              <div className="flex-1 bg-muted/5" />
            ) : dayEvents.length === 1 ? (
              <SingleEvent ev={dayEvents[0]} onClick={() => router.push(`/eventos/${dayEvents[0].slug}`)} />
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden">
                {dayEvents.map((ev) => (
                  <SingleEvent
                    key={ev.id}
                    ev={ev}
                    onClick={() => router.push(`/eventos/${ev.slug}`)}
                    compact
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function SingleEvent({
  ev,
  onClick,
  compact = false,
}: {
  ev: CalendarEvent;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className="flex-1 relative cursor-pointer group overflow-hidden min-h-0"
      style={ev.featured_image
        ? { backgroundImage: `url(${ev.featured_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : { background: 'linear-gradient(135deg,#FF6B00,#E55A00)' }
      }
    >
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(0,0,0,0.9) 0%,rgba(0,0,0,0.45) 55%,transparent 100%)' }} />
      <div className={cn('absolute bottom-0 inset-x-0 z-10', compact ? 'p-1.5' : 'p-2 md:p-3')}>
        <h4 className={cn('font-bold text-white leading-tight', compact ? 'text-[10px] line-clamp-2' : 'text-xs md:text-sm line-clamp-3 mb-1')}>
          {ev.title}
        </h4>
        {!compact && (
          <div className="flex items-center gap-1">
            <MapPin className="w-2.5 h-2.5 text-moto-orange flex-shrink-0" />
            <span className="text-white/80 text-xs truncate">{ev.location_city}</span>
          </div>
        )}
      </div>
      <div className="absolute inset-0 ring-0 group-hover:ring-2 group-hover:ring-moto-orange/50 ring-inset transition-all duration-300" />
    </div>
  );
}

// ─── WeekView ─────────────────────────────────────────────────────────────────

export function WeekView({ events, currentDate, onDateChange, onMenuToggle }: WeekViewProps) {
  const today = new Date();

  // Each panel = 7 days. Navigate by 7 days per swipe.
  // currentDate is the first day of the displayed week.
  const prevStart = useMemo(() => addDays(currentDate, -7), [currentDate]);
  const nextStart = useMemo(() => addDays(currentDate,  7), [currentDate]);

  const { trackRef, handlers, wheelHandler, resetPosition } = useSwipePanel({
    onNext: () => onDateChange(nextStart),
    onPrev: () => onDateChange(prevStart),
  });

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

  // ── Header label ─────────────────────────────────────────────────────────
  const endDate = addDays(currentDate, 6);
  const fmt = (d: Date) => `${d.getDate()} ${d.toLocaleDateString('es-ES', { month: 'short' })}`;
  const rangeLabel = `${fmt(currentDate)} – ${fmt(endDate)} ${endDate.getFullYear()}`;
  const isTodayInRange = isSameDay(currentDate, today) ||
    (today >= currentDate && today <= endDate);

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
        <span className={cn('text-sm md:text-base font-semibold truncate max-w-[200px] md:max-w-none', isTodayInRange && 'text-moto-orange')}>
          {rangeLabel}
        </span>
      </div>

      {/*
        3-panel strip — entire week panels slide as one unit.
        This is WHY numbers no longer flicker: we're transitioning a single
        block (7-column grid) rather than snapping 91 individual columns.
      */}
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
            <WeekPanel startDate={prevStart} events={events} />
          </div>
          <div style={{ width: 'calc(100%/3)', height: '100%', flexShrink: 0 }}>
            <WeekPanel startDate={currentDate} events={events} />
          </div>
          <div style={{ width: 'calc(100%/3)', height: '100%', flexShrink: 0 }}>
            <WeekPanel startDate={nextStart} events={events} />
          </div>
        </div>
      </div>
    </div>
  );
}
