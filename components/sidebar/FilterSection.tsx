// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { Filter, X, MapPin, Tag } from 'lucide-react';
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

export function FilterSection({ onFiltersChange }: FilterSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({ cities: [], eventTypes: [] });
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({ cities: [], eventTypes: [] });
  const [loading, setLoading] = useState(true);

  // Fetch filter options from approved events
  useEffect(() => {
    async function fetchFilterOptions() {
      try {
        const response = await fetch('/api/eventos?status=approved');
        if (!response.ok) throw new Error('Error al cargar eventos');
        
        const events = await response.json();
        
        // Extract unique cities and event types
        const cities = Array.from(new Set(events.map((e: any) => e.location_city).filter(Boolean))).sort();
        const eventTypes = Array.from(new Set(events.map((e: any) => e.event_type).filter(Boolean))).sort();
        
        setFilterOptions({ cities, eventTypes });
      } catch (error) {
        console.error('Error loading filter options:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFilterOptions();
  }, []);

  // Notify parent when filters change
  useEffect(() => {
    onFiltersChange?.(activeFilters);
  }, [activeFilters, onFiltersChange]);

  const toggleCity = (city: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      cities: prev.cities.includes(city)
        ? prev.cities.filter((c) => c !== city)
        : [...prev.cities, city],
    }));
  };

  const toggleEventType = (type: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      eventTypes: prev.eventTypes.includes(type)
        ? prev.eventTypes.filter((t) => t !== type)
        : [...prev.eventTypes, type],
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters({ cities: [], eventTypes: [] });
  };

  const hasActiveFilters = activeFilters.cities.length > 0 || activeFilters.eventTypes.length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center w-10 h-10">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-moto-orange" />
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Filter Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-lg transition-colors relative",
          hasActiveFilters
            ? "bg-moto-orange text-white"
            : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
        )}
        title="Filtrar eventos"
      >
        <Filter className="w-5 h-5" />
        
        {/* Active filter count badge */}
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-moto-orange text-xs font-bold rounded-full flex items-center justify-center">
            {activeFilters.cities.length + activeFilters.eventTypes.length}
          </span>
        )}

        {/* Tooltip on hover */}
        <span className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Filtros
        </span>
      </button>

      {/* Expanded Filter Panel */}
      {isExpanded && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsExpanded(false)}
          />

          {/* Filter Panel */}
          <div className="absolute left-full ml-2 top-0 w-64 bg-card border rounded-lg shadow-lg z-50 p-4 max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtros
              </h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Clear all button */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="w-full text-xs text-moto-orange hover:text-moto-orange-dark mb-4 text-left font-medium"
              >
                Limpiar todos los filtros
              </button>
            )}

            {/* Cities Filter */}
            {filterOptions.cities.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Ubicación
                </h4>
                <div className="space-y-1">
                  {filterOptions.cities.map((city) => (
                    <label
                      key={city}
                      className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/50 rounded px-2 py-1 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={activeFilters.cities.includes(city)}
                        onChange={() => toggleCity(city)}
                        className="rounded border-gray-300 text-moto-orange focus:ring-moto-orange/20"
                      />
                      <span>{city}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Event Types Filter */}
            {filterOptions.eventTypes.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  Tipo de Evento
                </h4>
                <div className="space-y-1">
                  {filterOptions.eventTypes.map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/50 rounded px-2 py-1 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={activeFilters.eventTypes.includes(type)}
                        onChange={() => toggleEventType(type)}
                        className="rounded border-gray-300 text-moto-orange focus:ring-moto-orange/20"
                      />
                      <span>{EVENT_TYPE_LABELS[type] || type}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {filterOptions.cities.length === 0 && filterOptions.eventTypes.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay eventos aprobados aún
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
