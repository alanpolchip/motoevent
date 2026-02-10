'use client';

import { useState, useEffect, useMemo } from 'react';
import { DayView } from './DayView';
import { ThreeDayView } from './ThreeDayView';
import { WeekView } from './WeekView';
import { BiweeklyView } from './BiweeklyView';
import { MonthView } from './MonthView';
import type { ActiveFilters } from '@/components/sidebar/FilterSection';

interface CalendarEvent {
  id: string;
  title: string;
  start_date: string;
  end_date?: string;
  location_city: string;
  event_type: string;
  featured_image?: string;
  short_description?: string;
  slug: string;
}

type ViewType = '1D' | '3D' | '1W' | '2W' | '4W';

interface CalendarViewProps {
  view: ViewType;
  /** Controlled: current date (managed by page.tsx, persisted in URL) */
  currentDate: Date;
  onDateChange: (date: Date) => void;
  filters?: ActiveFilters;
  onMenuToggle?: () => void;
}

export function CalendarView({ view, currentDate, onDateChange, filters, onMenuToggle }: CalendarViewProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/eventos')
      .then(r => r.json())
      .then(data => setEvents(data))
      .catch(err => console.error('Error loading events:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredEvents = useMemo(() => {
    if (!filters) return events;
    return events.filter((event) => {
      if (filters.cities.length > 0 && !filters.cities.includes(event.location_city)) return false;
      if (filters.eventTypes.length > 0 && !filters.eventTypes.includes(event.event_type)) return false;
      return true;
    });
  }, [events, filters]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moto-orange" />
      </div>
    );
  }

  const commonProps = {
    events: filteredEvents,
    currentDate,
    onDateChange,
    onMenuToggle,
  };

  return (
    <div className="h-screen overflow-hidden">
      {view === '1D' && <DayView {...commonProps} />}
      {view === '3D' && <ThreeDayView {...commonProps} />}
      {view === '1W' && <WeekView {...commonProps} />}
      {view === '2W' && <BiweeklyView {...commonProps} />}
      {view === '4W' && <MonthView {...commonProps} />}
    </div>
  );
}
