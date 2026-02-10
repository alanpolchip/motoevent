'use client';

import Link from 'next/link';
import { Edit, Plus, Moon, Sun, Shield, Menu, Info } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { FilterSection, type ActiveFilters } from './FilterSection';
import { UserButton } from '@/components/auth/UserButton';
import { useAuth } from '@/lib/auth/AuthContext';

type CalendarView = '1D' | '3D' | '1W' | '2W' | '4W';

interface SidebarProps {
  currentView?: CalendarView;
  onViewChange?: (view: CalendarView) => void;
  onFiltersChange?: (filters: ActiveFilters) => void;
  /** Mobile: si el drawer está abierto */
  isOpen?: boolean;
  /** Mobile: cerrar drawer */
  onClose?: () => void;
}

export function Sidebar({ currentView = '2W', onViewChange, onFiltersChange, isOpen = false, onClose }: SidebarProps) {
  const views: CalendarView[] = ['1D', '3D', '1W', '2W', '4W'];
  const { theme, setTheme } = useTheme();
  const { canSubmitEvents, canModerateEvents, isAdmin } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      {/* Overlay backdrop — solo en mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/*
        Sidebar siempre position:fixed — sin overflow-hidden ni opacity ni will-change.
        Esto evita crear un stacking context que rompería los position:fixed hijos
        (AuthModal, dropdowns). El espacio se gestiona via paddingLeft en page.tsx.
      */}
      <aside className={cn(
        "fixed left-0 top-0 h-screen w-[60px] bg-card border-r border-border",
        "flex flex-col items-center py-6 gap-6 z-50",
        "transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}>
      {/* User Button */}
      <UserButton />

      {/* Divider */}
      <div className="w-8 h-[1px] bg-border" />

      {/* Info / Landing page */}
      <Link
        href="/info"
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted hover:bg-muto-orange/10 hover:text-moto-orange transition-colors group relative"
        title="Sobre MotoEvents"
      >
        <Info className="w-5 h-5 text-muted-foreground group-hover:text-moto-orange transition-colors" />
        <span className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
          Sobre MotoEvents
        </span>
      </Link>

      {/* Divider */}
      <div className="w-8 h-[1px] bg-border" />

      {/* Filter Section — entre logo y selector de vistas */}
      <FilterSection onFiltersChange={onFiltersChange} />

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
              {view === '1D' ? '1 Día' : view === '3D' ? '3 Días' : view === '1W' ? '1 Semana' : view === '2W' ? '2 Semanas' : '4 Semanas'}
            </span>
          </button>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Spacer pequeño */}
      <div className="h-4" />

      {/* Moderar Button - Solo si tiene permisos */}
      {canModerateEvents && (
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
      )}

      {/* Admin Panel - Solo admin */}
      {isAdmin && (
        <Link
          href="/admin"
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted hover:bg-muted/80 transition-colors group relative"
          title="Panel Admin"
        >
          <Shield className="w-5 h-5 text-moto-orange group-hover:text-moto-orange transition-colors" />

          {/* Tooltip on hover */}
          <span className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Panel Admin
          </span>
        </Link>
      )}

      {/* Publicar Button - Solo si tiene permisos */}
      {canSubmitEvents && (
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
      )}

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
    </>
  );
}
