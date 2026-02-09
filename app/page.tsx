'use client';

import { useState } from 'react';
import { CalendarView } from '@/components/calendar/CalendarView';
import { CalendarSkeleton } from '@/components/calendar/CalendarSkeleton';
import { Sidebar } from '@/components/sidebar/Sidebar';
import type { ActiveFilters } from '@/components/sidebar/FilterSection';

type ViewType = '1W' | '2W' | '4W';

export default function HomePage() {
  const [currentView, setCurrentView] = useState<ViewType>('2W');
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({ cities: [], eventTypes: [] });

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Lateral */}
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        onFiltersChange={setActiveFilters}
      />

      {/* Calendar Section - Full viewport */}
      <main className="flex-1 ml-[60px]">
        <CalendarView view={currentView} filters={activeFilters} />
      </main>
    </div>
  );
}
