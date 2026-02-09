'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import { ArrowLeft, Clock, CheckCircle, XCircle, Edit3, Eye, AlertCircle } from 'lucide-react';
import { getCurrentRole, type UserRole } from '@/components/debug/RoleSelector';

interface Event {
  id: string;
  title: string;
  status: 'pending' | 'needs_edit' | 'approved' | 'rejected';
  location_city: string;
  start_date: string;
  event_type: string;
  organizer_name: string;
  created_at: string;
  rejection_reason?: string;
}

export default function ModerarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');

  useEffect(() => {
    setCurrentRole(getCurrentRole());
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const role = getCurrentRole();
        const response = await fetch(`/api/eventos?status=all&role=${role}`);
        if (!response.ok) {
          throw new Error('Error al cargar los eventos');
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const pendingEvents = events.filter(e => e.status === 'pending');
  const needsEditEvents = events.filter(e => e.status === 'needs_edit');
  const approvedEvents = events.filter(e => e.status === 'approved');
  const rejectedEvents = events.filter(e => e.status === 'rejected');

  if (loading) {
    return (
      <main className="min-h-screen bg-muted/30">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al calendario
            </Link>
            <h1 className="text-lg font-bold">
              <span className="text-moto-orange">Moto</span>Events
            </h1>
          </div>
        </header>
        <div className="flex items-center justify-center h-[calc(100vh-60px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moto-orange" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-muted/30">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al calendario
            </Link>
            <h1 className="text-lg font-bold">
              <span className="text-moto-orange">Moto</span>Events
            </h1>
          </div>
        </header>
        <div className="container py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h2 className="font-semibold text-red-800 mb-1">Error al cargar los eventos</h2>
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-3 text-sm text-red-700 underline hover:no-underline"
              >
                Intentar de nuevo
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al calendario
          </Link>
          <h1 className="text-lg font-bold">
            <span className="text-moto-orange">Moto</span>Events
          </h1>
        </div>
      </header>

      <div className="container py-6">
        {/* Título */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Panel de Moderación</h2>
          <p className="text-muted-foreground mt-1">
            Gestiona los eventos enviados por los usuarios
          </p>
        </div>

        {/* Resumen de estados */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => document.getElementById('section-pending')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="bg-card border rounded-lg p-4 text-left hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 text-yellow-600 mb-2">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Por Revisar</span>
            </div>
            <p className="text-2xl font-bold">{pendingEvents.length}</p>
          </button>
          <button
            onClick={() => document.getElementById('section-needs-edit')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="bg-card border rounded-lg p-4 text-left hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Edit3 className="w-5 h-5" />
              <span className="font-medium">Por Modificar</span>
            </div>
            <p className="text-2xl font-bold">{needsEditEvents.length}</p>
          </button>
          <button
            onClick={() => document.getElementById('section-approved')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="bg-card border rounded-lg p-4 text-left hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Validados</span>
            </div>
            <p className="text-2xl font-bold">{approvedEvents.length}</p>
          </button>
          <button
            onClick={() => document.getElementById('section-rejected')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="bg-card border rounded-lg p-4 text-left hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <XCircle className="w-5 h-5" />
              <span className="font-medium">Descartados</span>
            </div>
            <p className="text-2xl font-bold">{rejectedEvents.length}</p>
          </button>
        </div>

        {/* Sección: Por Revisar */}
        <section id="section-pending" className="mb-8 scroll-mt-20">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            Por Revisar
          </h3>
          <div className="bg-card border rounded-lg overflow-hidden">
            {pendingEvents.length === 0 ? (
              <p className="p-8 text-center text-muted-foreground">
                No hay eventos pendientes de revisión
              </p>
            ) : (
              <div className="divide-y">
                {pendingEvents.map((event) => (
                  <div key={event.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-semibold">{event.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>📅 {new Date(event.start_date).toLocaleDateString('es-ES')}</span>
                        <span>📍 {event.location_city}</span>
                        <span>👤 {event.organizer_name}</span>
                        <span className="capitalize">🏷️ {event.event_type}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/moderar/${event.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md bg-muted hover:bg-muted/80 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Ver detalle
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Sección: Por Modificar */}
        <section id="section-needs-edit" className="mb-8 scroll-mt-20">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-blue-600" />
            Por Modificar
          </h3>
          <div className="bg-card border rounded-lg overflow-hidden">
            {needsEditEvents.length === 0 ? (
              <p className="p-8 text-center text-muted-foreground">
                No hay eventos que necesiten modificación
              </p>
            ) : (
              <div className="divide-y">
                {needsEditEvents.map((event) => (
                  <div key={event.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-semibold">{event.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>📅 {new Date(event.start_date).toLocaleDateString('es-ES')}</span>
                        <span>📍 {event.location_city}</span>
                        <span>👤 {event.organizer_name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/moderar/${event.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md bg-muted hover:bg-muted/80 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Ver detalle
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Sección: Validados */}
        <section id="section-approved" className="mb-8 scroll-mt-20">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Validados
          </h3>
          <div className="bg-card border rounded-lg overflow-hidden">
            {approvedEvents.length === 0 ? (
              <p className="p-8 text-center text-muted-foreground">
                No hay eventos validados
              </p>
            ) : (
              <div className="divide-y">
                {approvedEvents.map((event) => (
                  <div key={event.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-semibold">{event.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>📅 {new Date(event.start_date).toLocaleDateString('es-ES')}</span>
                        <span>📍 {event.location_city}</span>
                        <span>👤 {event.organizer_name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/moderar/${event.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md bg-muted hover:bg-muted/80 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Ver detalle
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Sección: Descartados */}
        <section id="section-rejected" className="mb-8 scroll-mt-20">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            Descartados
          </h3>
          <div className="bg-card border rounded-lg overflow-hidden">
            {rejectedEvents.length === 0 ? (
              <p className="p-8 text-center text-muted-foreground">
                No hay eventos descartados
              </p>
            ) : (
              <div className="divide-y">
                {rejectedEvents.map((event) => (
                  <div key={event.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-semibold">{event.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>📅 {new Date(event.start_date).toLocaleDateString('es-ES')}</span>
                        <span>📍 {event.location_city}</span>
                        <span>👤 {event.organizer_name}</span>
                      </div>
                      {event.rejection_reason && (
                        <p className="text-sm text-red-600 mt-2">
                          📝 {event.rejection_reason}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/moderar/${event.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md bg-muted hover:bg-muted/80 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Ver detalle
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
