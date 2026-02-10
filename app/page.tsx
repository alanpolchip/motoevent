'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { CalendarView } from '@/components/calendar/CalendarView';
import { Sidebar } from '@/components/sidebar/Sidebar';
import type { ActiveFilters } from '@/components/sidebar/FilterSection';

type ViewType = '1D' | '3D' | '1W' | '2W' | '4W';

const SIDEBAR_WIDTH = 60;
const VALID_VIEWS: ViewType[] = ['1D', '3D', '1W', '2W', '4W'];

function parseDateParam(s: string | null): Date | null {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  return isNaN(date.getTime()) ? null : date;
}

function formatDateParam(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function HomePage() {
  // ── State: starts with defaults, then URL overrides on mount ─────────────
  const [currentView, setCurrentView] = useState<ViewType>('4W');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({ cities: [], eventTypes: [] });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ready, setReady] = useState(false); // prevents flash before URL parsed

  // ── Read URL params on mount (client-only, no Suspense needed) ───────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view') as ViewType | null;
    const dateParam = params.get('date');

    if (viewParam && VALID_VIEWS.includes(viewParam)) setCurrentView(viewParam);
    const parsedDate = parseDateParam(dateParam);
    if (parsedDate) setCurrentDate(parsedDate);

    setReady(true);
  }, []);

  // ── Sidebar: open by default on desktop ──────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    setSidebarOpen(mq.matches);
    const handler = (e: MediaQueryListEvent) => setSidebarOpen(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // ── Sync view + date into URL ─────────────────────────────────────────────
  // history.replaceState: no React dependency, no Suspense requirement,
  // no extra history entry (Back button goes to previous page, e.g. event detail).
  const syncUrl = useCallback((view: ViewType, date: Date) => {
    const params = new URLSearchParams({ view, date: formatDateParam(date) });
    history.replaceState(null, '', `/?${params.toString()}`);
  }, []);

  const handleViewChange = useCallback((view: ViewType) => {
    setCurrentView(view);
    syncUrl(view, currentDate);
  }, [currentDate, syncUrl]);

  const handleDateChange = useCallback((date: Date) => {
    setCurrentDate(date);
    syncUrl(currentView, date);
  }, [currentView, syncUrl]);

  // Don't render until URL has been parsed (avoids 1-frame flash with wrong date)
  if (!ready) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-moto-orange" />
      </div>
    );
  }

  return (
    <div
      className="h-screen overflow-hidden"
      style={{
        paddingLeft: sidebarOpen ? SIDEBAR_WIDTH : 0,
        transition: 'padding-left 300ms ease',
      }}
    >
      <Sidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        onFiltersChange={setActiveFilters}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="w-full h-full overflow-hidden">
        <CalendarView
          view={currentView}
          currentDate={currentDate}
          onDateChange={handleDateChange}
          filters={activeFilters}
          onMenuToggle={() => setSidebarOpen(prev => !prev)}
        />
      </main>
    </div>
  );
}
