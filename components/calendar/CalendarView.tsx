'use client';

import { useState, useEffect } from 'react';
import { WeekView } from './WeekView';
import { BiweeklyView } from './BiweeklyView';
import { MonthView } from './MonthView';
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

type ViewType = '1W' | '2W' | '4W';

interface CalendarViewProps {
  view: ViewType;
}

export function CalendarView({ view }: CalendarViewProps) {
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

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moto-orange" />
      </div>
    );
  }

  // Render view based on selection
  const commonProps = {
    events,
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
