'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { APP_NAME } from '@/lib/constants';
import { ArrowLeft, CheckCircle, XCircle, Edit3, Calendar, MapPin, User, Clock, MessageSquare } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  short_description: string;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  location_city: string;
  location_name: string;
  location_address: string | null;
  event_type: string;
  motorcycle_types: string[];
  featured_image: string;
  organizer_name: string;
  organizer_email: string | null;
  organizer_phone: string | null;
  status: 'pending' | 'needs_edit' | 'approved' | 'rejected';
  submitted_by: string | null;
  created_at: string;
  rejection_reason: string | null;
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function ModerarDetallePage({ params }: PageProps) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState<Partial<Event>>({});
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch event data
  useEffect(() => {
    async function fetchEvent() {
      try {
        const response = await fetch(`/api/eventos?id=${params.id}`);
        if (!response.ok) {
          throw new Error('Error al cargar el evento');
        }
        const data = await response.json();
        setEvent(data);
        setEditedEvent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [params.id]);

  // Update event status
  const updateStatus = async (newStatus: string, reason?: string) => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/eventos`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: params.id,
          status: newStatus,
          rejectionReason: reason,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado');
      }

      const updatedEvent = await response.json();
      setEvent(updatedEvent);
      
      if (newStatus === 'rejected') {
        setShowRejectModal(false);
        setRejectionReason('');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al actualizar');
    } finally {
      setActionLoading(false);
    }
  };

  // Save edited event
  const saveEdits = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/eventos`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedEvent),
      });

      if (!response.ok) {
        throw new Error('Error al guardar los cambios');
      }

      const updatedEvent = await response.json();
      setEvent(updatedEvent);
      setIsEditing(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setActionLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedEvent(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moto-orange" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Evento no encontrado'}</p>
          <Link href="/moderar" className="text-moto-orange hover:underline">
            Volver al panel de moderación
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = () => {
    switch (event.status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            ⏳ Por Revisar
          </span>
        );
      case 'needs_edit':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            ✏️ Por Modificar
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            ✅ Validado
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            ❌ Descartado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link 
            href="/moderar" 
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a moderación
          </Link>
          <h1 className="text-lg font-bold">
            <span className="text-moto-orange">Moto</span>Events
          </h1>
        </div>
      </header>

      <div className="container py-6">
        {/* Estado del evento */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Detalle del Evento</h2>
            <p className="text-muted-foreground mt-1">
              Revisa y gestiona este evento
            </p>
          </div>
          {getStatusBadge()}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* --- FORMULARIO DE EDICIÓN --- */}
            
            {/* Imagen principal y URL */}
            <div className="bg-card border rounded-lg overflow-hidden">
              <div className="aspect-video relative">
                <img
                   src={editedEvent.featured_image || event.featured_image}
                   alt={editedEvent.title || event.title}
                   className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <div className="p-4 border-t">
                  <label htmlFor="featured_image" className="text-sm font-medium text-muted-foreground block mb-1">URL de la Imagen</label>
                  <input
                    type="url"
                    id="featured_image"
                    name="featured_image"
                    value={editedEvent.featured_image || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                  />
                </div>
              )}
            </div>

            {/* Información principal */}
            <div className="bg-card border rounded-lg p-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="text-sm font-medium text-muted-foreground">Título del evento</label>
                    <input type="text" id="title" name="title" value={editedEvent.title || ''} onChange={handleInputChange} className="w-full text-xl font-bold mt-1 p-2 border rounded-md bg-background"/>
                  </div>
                  <div>
                    <label htmlFor="description" className="text-sm font-medium text-muted-foreground">Descripción</label>
                    <textarea id="description" name="description" value={editedEvent.description || ''} onChange={handleInputChange} rows={5} className="w-full mt-1 p-2 border rounded-md bg-background"/>
                  </div>
                  <div>
                    <label htmlFor="short_description" className="text-sm font-medium text-muted-foreground">Descripción corta</label>
                    <input type="text" id="short_description" name="short_description" value={editedEvent.short_description || ''} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md bg-background"/>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold mb-4">{event.title}</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Descripción</h4>
                      <p className="text-foreground whitespace-pre-wrap">{event.description}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Descripción corta</h4>
                      <p className="text-sm text-muted-foreground">{event.short_description}</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Detalles del evento */}
            <div className="bg-card border rounded-lg p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-moto-orange" />
                Detalles del Evento
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isEditing ? (
                  <>
                    <div><label className="text-sm text-muted-foreground">Fecha de inicio</label><input type="date" name="start_date" value={editedEvent.start_date?.split('T')[0] || ''} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md bg-background"/></div>
                    <div><label className="text-sm text-muted-foreground">Fecha de fin</label><input type="date" name="end_date" value={editedEvent.end_date?.split('T')[0] || ''} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md bg-background"/></div>
                    <div><label className="text-sm text-muted-foreground">Hora de inicio</label><input type="time" name="start_time" value={editedEvent.start_time || ''} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md bg-background"/></div>
                    <div><label className="text-sm text-muted-foreground">Hora de fin</label><input type="time" name="end_time" value={editedEvent.end_time || ''} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md bg-background"/></div>
                    <div>
                      <label className="text-sm text-muted-foreground">Tipo de evento</label>
                      <select name="event_type" value={editedEvent.event_type || ''} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md bg-background">
                        <option value="concentracion">Concentración</option>
                        <option value="ruta">Ruta</option>
                        <option value="competicion">Competición</option>
                        <option value="feria">Feria</option>
                        <option value="taller">Taller</option>
                        <option value="quedada">Quedada</option>
                        <option value="benefico">Benéfico</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>
                    <div><label className="text-sm text-muted-foreground">Tipos de moto (separado por comas)</label><input type="text" name="motorcycle_types" value={Array.isArray(editedEvent.motorcycle_types) ? editedEvent.motorcycle_types.join(', ') : ''} onChange={(e) => setEditedEvent(prev => ({...prev, motorcycle_types: e.target.value.split(',').map(t => t.trim())}))} className="w-full mt-1 p-2 border rounded-md bg-background"/></div>
                  </>
                ) : (
                  <>
                    <div><span className="text-sm text-muted-foreground">Fecha de inicio</span><p className="font-medium">{event.start_date}</p></div>
                    <div><span className="text-sm text-muted-foreground">Fecha de fin</span><p className="font-medium">{event.end_date || 'Mismo día'}</p></div>
                    <div><span className="text-sm text-muted-foreground">Hora de inicio</span><p className="font-medium">{event.start_time}</p></div>
                    <div><span className="text-sm text-muted-foreground">Hora de fin</span><p className="font-medium">{event.end_time}</p></div>
                    <div><span className="text-sm text-muted-foreground">Tipo de evento</span><p className="font-medium capitalize">{event.event_type}</p></div>
                    <div><span className="text-sm text-muted-foreground">Tipos de moto</span><p className="font-medium">{event.motorcycle_types?.join(', ')}</p></div>
                  </>
                )}
              </div>
            </div>

            {/* Ubicación */}
            <div className="bg-card border rounded-lg p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-moto-orange" />
                Ubicación
              </h4>
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div><label className="text-sm text-muted-foreground">Ciudad</label><input type="text" name="location_city" value={editedEvent.location_city || ''} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md bg-background"/></div>
                    <div><label className="text-sm text-muted-foreground">Lugar</label><input type="text" name="location_name" value={editedEvent.location_name || ''} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md bg-background"/></div>
                    <div><label className="text-sm text-muted-foreground">Dirección</label><input type="text" name="location_address" value={editedEvent.location_address || ''} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md bg-background"/></div>
                  </>
                ) : (
                  <>
                    <div><span className="text-sm text-muted-foreground">Ciudad</span><p className="font-medium">{event.location_city}</p></div>
                    <div><span className="text-sm text-muted-foreground">Lugar</span><p className="font-medium">{event.location_name}</p></div>
                    <div><span className="text-sm text-muted-foreground">Dirección</span><p className="font-medium">{event.location_address}</p></div>
                  </>
                )}
              </div>
            </div>
            
            {/* Botones de Guardar / Cancelar */}
            {isEditing && (
              <div className="flex items-center gap-4 sticky bottom-4">
                <button
                  onClick={saveEdits}
                  disabled={actionLoading}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-moto-orange text-white font-medium hover:bg-moto-orange-dark transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedEvent(event); // Reset changes
                  }}
                  disabled={actionLoading}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            )}

          </div>

          {/* Columna lateral */}
          <div className="space-y-6">
            {/* Acciones de moderación */}
            <div className="bg-card border rounded-lg p-6">
              <h4 className="font-semibold mb-4">Acciones</h4>
              
              <div className="space-y-3">
                
                {!isEditing ? (
                  <>
                    {/* Botón para entrar en modo edición */}
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Edit3 className="w-5 h-5" />
                      Modificar Evento
                    </button>

                    {/* Validar y Publicar */}
                    {(event.status === 'pending' || event.status === 'needs_edit') && (
                      <button
                        onClick={() => updateStatus('approved')}
                        disabled={actionLoading}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle className="w-5 h-5" />
                        {actionLoading ? 'Procesando...' : 'Validar y Publicar'}
                      </button>
                    )}
                    
                    {/* Rechazar Evento */}
                    {(event.status === 'pending' || event.status === 'needs_edit') && (
                      <button
                        onClick={() => setShowRejectModal(true)}
                        disabled={actionLoading}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-5 h-5" />
                        Rechazar Evento
                      </button>
                    )}
                    
                    {/* Restaurar a pendiente */}
                    {event.status === 'rejected' && (
                      <button
                        onClick={() => updateStatus('pending')}
                        disabled={actionLoading}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-yellow-600 text-white font-medium hover:bg-yellow-700 transition-colors disabled:opacity-50"
                      >
                        <Clock className="w-5 h-5" />
                        Restaurar a Por Revisar
                      </button>
                    )}
                    
                    {/* Descartar desde approved */}
                    {event.status === 'approved' && (
                      <button
                        onClick={() => setShowRejectModal(true)}
                        disabled={actionLoading}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-5 h-5" />
                        Descartar Evento
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground text-center p-4 bg-blue-50/50 rounded-md border border-blue-200">
                    Actualmente en modo edición. Guarda o cancela tus cambios para realizar otras acciones.
                  </p>
                )}
              </div>
            </div>
            
            {/* Modal de rechazo */}
            {showRejectModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                  <h3 className="text-lg font-semibold mb-4">¿Por qué rechazas este evento?</h3>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Escribe el motivo del rechazo..."
                    className="w-full px-3 py-2 border rounded-md mb-4 min-h-[100px]"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => updateStatus('rejected', rejectionReason)}
                      disabled={!rejectionReason || actionLoading}
                      className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                      {actionLoading ? 'Procesando...' : 'Confirmar Rechazo'}
                    </button>
                    <button
                      onClick={() => {
                        setShowRejectModal(false);
                        setRejectionReason('');
                      }}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Información del envío */}
            <div className="bg-card border rounded-lg p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-moto-orange" />
                Información del Envío
              </h4>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">Enviado por</span>
                  <p className="font-medium">{event.submitted_by || 'Anónimo'}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Email</span>
                  <p className="font-medium">{event.organizer_email || '-'}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Fecha de envío</span>
                  <p className="font-medium">{event.created_at}</p>
                </div>
              </div>
            </div>

            {/* Organizador */}
            <div className="bg-card border rounded-lg p-6">
              <h4 className="font-semibold mb-4">Organizador</h4>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">Nombre</span>
                  <p className="font-medium">{event.organizer_name}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Email</span>
                  <p className="font-medium">{event.organizer_email || '-'}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Teléfono</span>
                  <p className="font-medium">{event.organizer_phone || '-'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
