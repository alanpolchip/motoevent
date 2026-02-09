'use client';

import { useState, useEffect, useMemo } from 'react';
import { WeekView } from './WeekView';
import { BiweeklyView } from './BiweeklyView';
import { MonthView } from './MonthView';
import { cn } from '@/lib/utils/cn';
import type { ActiveFilters } from '@/components/sidebar/FilterSection';

interface CalendarEvent {
  id: string;
  title: string;
  start_date: string;
  end_date?: string;
  location_city: string;
  event_type: string;
  featured_image?: string;
  slug: string;
}

type ViewType = '1W' | '2W' | '4W';

interface CalendarViewProps {
  view: ViewType;
  filters?: ActiveFilters;
}

export function CalendarView({ view, filters }: CalendarViewProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Smooth transition on date change
  const handleDateChange = (newDate: Date) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentDate(newDate);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 150);
  };

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

  // Apply filters to events
  const filteredEvents = useMemo(() => {
    if (!filters) return events;

    return events.filter((event) => {
      // Filter by city
      if (filters.cities.length > 0 && !filters.cities.includes(event.location_city)) {
        return false;
      }

      // Filter by event type
      if (filters.eventTypes.length > 0 && !filters.eventTypes.includes(event.event_type)) {
        return false;
      }

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

  // Render view based on selection
  const commonProps = {
    events: filteredEvents,
    currentDate,
    onDateChange: handleDateChange,
  };

  return (
    <div className={cn(
      "transition-opacity duration-200",
      isTransitioning ? "opacity-40" : "opacity-100"
    )}>
      {view === '1W' && <WeekView {...commonProps} />}
      {view === '2W' && <BiweeklyView {...commonProps} />}
      {view === '4W' && <MonthView {...commonProps} />}
    </div>
  );
}
