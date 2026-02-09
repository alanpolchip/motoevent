'use client';

import Link from 'next/link';
import { Edit, Plus, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { FilterSection, type ActiveFilters } from './FilterSection';

type CalendarView = '1W' | '2W' | '4W';

interface SidebarProps {
  currentView?: CalendarView;
  onViewChange?: (view: CalendarView) => void;
  onFiltersChange?: (filters: ActiveFilters) => void;
}

export function Sidebar({ currentView = '2W', onViewChange, onFiltersChange }: SidebarProps) {
  const views: CalendarView[] = ['1W', '2W', '4W'];
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[60px] bg-card border-r border-border flex flex-col items-center py-6 gap-6 z-50">
      {/* Logo MotoEvents */}
      <Link 
        href="/" 
        className="flex items-center justify-center w-10 h-10 rounded-full bg-moto-orange hover:bg-moto-orange-dark transition-colors"
        title="MotoEvents Calendar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6 text-white"
        >
          <circle cx="5.5" cy="17.5" r="3.5" />
          <circle cx="18.5" cy="17.5" r="3.5" />
          <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2" />
        </svg>
      </Link>

      {/* Divider */}
      <div className="w-8 h-[1px] bg-border" />

      {/* View Selector */}
      <div className="flex flex-col gap-2">
        {views.map((view) => (
          <button
            key={view}
            onClick={() => onViewChange?.(view)}
            className={cn(
              "flex items-center justify-center w-10 h-8 rounded-md text-xs font-bold transition-colors relative group",
              currentView === view
                ? "bg-moto-orange text-white"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            title={`Vista ${view}`}
          >
            {view}
            
            {/* Tooltip on hover */}
            <span className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {view === '1W' ? '1 Semana' : view === '2W' ? '2 Semanas' : '4 Semanas'}
            </span>
          </button>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Filter Section */}
      <FilterSection onFiltersChange={onFiltersChange} />

      {/* Spacer pequeño */}
      <div className="h-4" />

      {/* Moderar Button */}
      <Link
        href="/moderar"
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted hover:bg-muted/80 transition-colors group relative"
        title="Moderar Eventos"
      >
        <Edit className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        
        {/* Tooltip on hover */}
        <span className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Moderar
        </span>
      </Link>

      {/* Publicar Button */}
      <Link
        href="/submit-evento"
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-moto-orange hover:bg-moto-orange-dark transition-colors group relative"
        title="Publicar Evento"
      >
        <Plus className="w-5 h-5 text-white" />
        
        {/* Tooltip on hover */}
        <span className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Publicar
        </span>
      </Link>

      {/* Spacer pequeño */}
      <div className="h-4" />

      {/* Theme Toggle Button */}
      {mounted && (
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted hover:bg-muted/80 transition-colors group relative"
          title="Cambiar tema"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          ) : (
            <Moon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          )}
          
          {/* Tooltip on hover */}
          <span className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
          </span>
        </button>
      )}
    </aside>
  );
}
