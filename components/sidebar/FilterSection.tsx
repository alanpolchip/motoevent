// @ts-nocheck
'use client';

import { useState, useEffect, useRef } from 'react';
import { Filter, X, MapPin, Tag, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface FilterOptions {
  cities: string[];
  eventTypes: string[];
}

export interface ActiveFilters {
  cities: string[];
  eventTypes: string[];
}

interface FilterSectionProps {
  onFiltersChange?: (filters: ActiveFilters) => void;
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  concentracion: 'Concentración',
  ruta: 'Ruta',
  competicion: 'Competición',
  feria: 'Feria',
  taller: 'Taller',
  quedada: 'Quedada',
  benefico: 'Benéfico',
  otro: 'Otro',
};

// ─── Accordion topic ────────────────────────────────────────────────────────

function FilterTopic({
  label,
  icon: Icon,
  options,
  selected,
  onToggle,
  labelMap,
}: {
  label: string;
  icon: React.ElementType;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  labelMap?: Record<string, string>;
}) {
  const [open, setOpen] = useState(false);

  if (options.length === 0) return null;

  return (
    <div className="border-b last:border-b-0">
      {/* Topic header — clickable to expand/collapse */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition-colors text-left"
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          <Icon className="w-3.5 h-3.5 text-moto-orange" />
          <span>{label}</span>
          {selected.length > 0 && (
            <span className="px-1.5 py-0.5 bg-moto-orange text-white text-[10px] font-bold rounded-full leading-none">
              {selected.length}
            </span>
          )}
        </div>
        <ChevronRight className={cn(
          'w-3.5 h-3.5 text-muted-foreground transition-transform duration-200',
          open && 'rotate-90',
        )} />
      </button>

      {/* Options list — animated expand/collapse */}
      <div className={cn(
        'overflow-hidden transition-all duration-200',
        open ? 'max-h-60' : 'max-h-0',
      )}>
        <div className="px-3 pb-3 space-y-0.5">
          {options.map((opt) => {
            const isActive = selected.includes(opt);
            const displayLabel = labelMap?.[opt] ?? opt;
            return (
              <label
                key={opt}
                className={cn(
                  'flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm cursor-pointer transition-colors',
                  isActive ? 'bg-moto-orange/10 text-moto-orange font-medium' : 'hover:bg-muted/50 text-foreground',
                )}
              >
                {/* Custom checkbox */}
                <span className={cn(
                  'flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors',
                  isActive ? 'bg-moto-orange border-moto-orange' : 'border-border',
                )}>
                  {isActive && (
                    <svg viewBox="0 0 10 8" className="w-2.5 h-2 fill-white">
                      <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => onToggle(opt)}
                  className="sr-only"
                />
                <span className="truncate">{displayLabel}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── FilterSection ────────────────────────────────────────────────────────────

export function FilterSection({ onFiltersChange }: FilterSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({ cities: [], eventTypes: [] });
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({ cities: [], eventTypes: [] });
  const [loading, setLoading] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/eventos')
      .then(r => r.json())
      .then((events: any[]) => {
        const cities     = [...new Set(events.map(e => e.location_city).filter(Boolean))].sort() as string[];
        const eventTypes = [...new Set(events.map(e => e.event_type).filter(Boolean))].sort() as string[];
        setFilterOptions({ cities, eventTypes });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    onFiltersChange?.(activeFilters);
  }, [activeFilters, onFiltersChange]);

  const toggleCity = (city: string) => setActiveFilters(prev => ({
    ...prev,
    cities: prev.cities.includes(city) ? prev.cities.filter(c => c !== city) : [...prev.cities, city],
  }));

  const toggleType = (type: string) => setActiveFilters(prev => ({
    ...prev,
    eventTypes: prev.eventTypes.includes(type) ? prev.eventTypes.filter(t => t !== type) : [...prev.eventTypes, type],
  }));

  const clearAll = () => setActiveFilters({ cities: [], eventTypes: [] });

  const totalActive = activeFilters.cities.length + activeFilters.eventTypes.length;
  const hasActive   = totalActive > 0;

  return (
    <div className="relative">
      {/* ── Trigger button ─────────────────────────────────────────────────── */}
      <button
        onClick={() => setIsExpanded(v => !v)}
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-lg transition-colors relative group',
          hasActive
            ? 'bg-moto-orange text-white'
            : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground',
        )}
        title="Filtros"
      >
        <SlidersHorizontal className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} />

        {/* Active count badge */}
        {hasActive && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-moto-orange text-[10px] font-bold rounded-full flex items-center justify-center">
            {totalActive}
          </span>
        )}

        {/* Tooltip */}
        <span className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
          Filtros {hasActive ? `(${totalActive} activos)` : ''}
        </span>
      </button>

      {/* ── Panel ──────────────────────────────────────────────────────────── */}
      {isExpanded && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsExpanded(false)} />

          <div
            ref={panelRef}
            className="absolute left-full ml-3 top-0 w-64 bg-card border rounded-xl shadow-xl z-50 overflow-hidden"
            style={{ maxHeight: 'calc(100vh - 120px)' }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/20">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-moto-orange" />
                <span className="font-semibold text-sm">Filtros</span>
                {hasActive && (
                  <span className="px-1.5 py-0.5 bg-moto-orange text-white text-[10px] font-bold rounded-full">
                    {totalActive}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {hasActive && (
                  <button
                    onClick={clearAll}
                    className="text-xs text-moto-orange hover:underline font-medium"
                  >
                    Limpiar
                  </button>
                )}
                <button onClick={() => setIsExpanded(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-moto-orange" />
              </div>
            )}

            {/* Topics — each is an accordion */}
            {!loading && (
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                <FilterTopic
                  label="Ubicación"
                  icon={MapPin}
                  options={filterOptions.cities}
                  selected={activeFilters.cities}
                  onToggle={toggleCity}
                />
                <FilterTopic
                  label="Tipo de Evento"
                  icon={Tag}
                  options={filterOptions.eventTypes}
                  selected={activeFilters.eventTypes}
                  onToggle={toggleType}
                  labelMap={EVENT_TYPE_LABELS}
                />

                {filterOptions.cities.length === 0 && filterOptions.eventTypes.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6 px-4">
                    No hay eventos disponibles para filtrar
                  </p>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
