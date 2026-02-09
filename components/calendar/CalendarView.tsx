'use client';

import { useState, useEffect } from 'react';
import { WeekView } from './WeekView';
import { BiweeklyView } from './BiweeklyView';
import { MonthView } from './MonthView';

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
    onDateChange: setCurrentDate,
  };

  switch (view) {
    case '1W':
      return <WeekView {...commonProps} />;
    case '2W':
      return <BiweeklyView {...commonProps} />;
    case '4W':
      return <MonthView {...commonProps} />;
    default:
      return <BiweeklyView {...commonProps} />;
  }
}
