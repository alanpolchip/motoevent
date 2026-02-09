'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, Edit3, Calendar, MapPin, User, Eye, AlertTriangle, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

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
  location_country: string;
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
  moderated_at: string | null;
}

interface ValidationError {
  field: string;
  message: string;
}

export default function ModerarDetallePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { showToast, ToastComponent } = useToast();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState<Partial<Event>>({});
  const [actionLoading, setActionLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    fetchEvent();
  }, [params.id]);

  async function fetchEvent() {
    try {
      const response = await fetch(`/api/eventos?id=${params.id}`);
      if (!response.ok) throw new Error('Error al cargar el evento');
      const data = await response.json();
      setEvent(data);
      setEditedEvent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      showToast('Error al cargar el evento', 'error');
    } finally {
      setLoading(false);
    }
  }

  // Validación
  function validateEvent(eventData: Partial<Event>): ValidationError[] {
    const errors: ValidationError[] = [];
    
    if (!eventData.title || eventData.title.trim().length < 5) {
      errors.push({ field: 'title', message: 'El título debe tener al menos 5 caracteres' });
    }
    if (!eventData.description || eventData.description.trim().length < 20) {
      errors.push({ field: 'description', message: 'La descripción debe tener al menos 20 caracteres' });
    }
    if (!eventData.start_date) {
      errors.push({ field: 'start_date', message: 'La fecha de inicio es obligatoria' });
    }
    if (!eventData.location_city) {
      errors.push({ field: 'location_city', message: 'La ciudad es obligatoria' });
    }
    if (!eventData.location_name) {
      errors.push({ field: 'location_name', message: 'El lugar es obligatorio' });
    }
    if (!eventData.organizer_name) {
      errors.push({ field: 'organizer_name', message: 'El nombre del organizador es obligatorio' });
    }
    if (!eventData.featured_image) {
      errors.push({ field: 'featured_image', message: 'La imagen destacada es obligatoria' });
    }

    return errors;
  }

  async function updateStatus(newStatus: string, reason?: string) {
    // Validar antes de aprobar
    if (newStatus === 'approved') {
      const errors = validateEvent(editedEvent);
      if (errors.length > 0) {
        setValidationErrors(errors);
        showToast(`No se puede aprobar: ${errors.length} errores de validación`, 'error');
        return;
      }
    }

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

      if (!response.ok) throw new Error('Error al actualizar el estado');

      const updatedEvent = await response.json();
      setEvent(updatedEvent);
      
      if (newStatus === 'approved') {
        showToast('✅ Evento aprobado y publicado correctamente', 'success');
      } else if (newStatus === 'rejected') {
        showToast('❌ Evento rechazado', 'warning');
        setShowRejectModal(false);
        setRejectionReason('');
      } else if (newStatus === 'pending') {
        showToast('⏳ Evento restaurado a revisión', 'success');
      }

      // Refresh para cargar historial
      setTimeout(fetchEvent, 500);
    } catch (err) {
      showToast('Error al actualizar el evento', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  async function saveEdits() {
    const errors = validateEvent(editedEvent);
    if (errors.length > 0) {
      setValidationErrors(errors);
      showToast(`${errors.length} errores de validación`, 'error');
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`/api/eventos`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedEvent),
      });

      if (!response.ok) throw new Error('Error al guardar');

      const updatedEvent = await response.json();
      setEvent(updatedEvent);
      setIsEditing(false);
      setValidationErrors([]);
      showToast('✅ Cambios guardados correctamente', 'success');
    } catch (err) {
      showToast('Error al guardar los cambios', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedEvent(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo
    setValidationErrors(prev => prev.filter(err => err.field !== name));
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
    const badges = {
      pending: { label: '⏳ Por Revisar', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
      needs_edit: { label: '✏️ Por Modificar', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
      approved: { label: '✅ Aprobado', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
      rejected: { label: '❌ Rechazado', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
    };
    const badge = badges[event.status];
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.className}`}>
        {badge.label}
      </span>
    );
  };

  const getFieldError = (field: string) => {
    return validationErrors.find(err => err.field === field);
  };

  return (
    <main className="min-h-screen bg-background">
      {ToastComponent}

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <Link 
            href="/moderar" 
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a moderación
          </Link>
          <div className="flex items-center gap-4">
            {getStatusBadge()}
            {!isEditing && (
              <button
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-muted hover:bg-muted/80 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="container py-6">
        {/* Validación Summary */}
        {validationErrors.length > 0 && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                  {validationErrors.length} {validationErrors.length === 1 ? 'error encontrado' : 'errores encontrados'}
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-400">
                  {validationErrors.map((err, i) => (
                    <li key={i}>{err.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Imagen */}
            <div className="bg-card border rounded-lg overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={editedEvent.featured_image || event.featured_image}
                  alt={editedEvent.title || event.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200';
                  }}
                />
              </div>
              {isEditing && (
                <div className="p-4 border-t">
                  <label className="text-sm font-medium mb-1 block">URL de la Imagen</label>
                  <input
                    type="url"
                    name="featured_image"
                    value={editedEvent.featured_image || ''}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md bg-background text-sm ${
                      getFieldError('featured_image') ? 'border-red-500' : ''
                    }`}
                  />
                  {getFieldError('featured_image') && (
                    <p className="text-xs text-red-600 mt-1">{getFieldError('featured_image')?.message}</p>
                  )}
                </div>
              )}
            </div>

            {/* Info Principal */}
            <div className="bg-card border rounded-lg p-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Título</label>
                    <input
                      type="text"
                      name="title"
                      value={editedEvent.title || ''}
                      onChange={handleInputChange}
                      className={`w-full text-xl font-bold p-2 border rounded-md bg-background ${
                        getFieldError('title') ? 'border-red-500' : ''
                      }`}
                    />
                    {getFieldError('title') && (
                      <p className="text-xs text-red-600 mt-1">{getFieldError('title')?.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Descripción</label>
                    <textarea
                      name="description"
                      value={editedEvent.description || ''}
                      onChange={handleInputChange}
                      rows={5}
                      className={`w-full p-2 border rounded-md bg-background ${
                        getFieldError('description') ? 'border-red-500' : ''
                      }`}
                    />
                    {getFieldError('description') && (
                      <p className="text-xs text-red-600 mt-1">{getFieldError('description')?.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Descripción corta</label>
                    <input
                      type="text"
                      name="short_description"
                      value={editedEvent.short_description || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md bg-background"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold mb-4">{event.title}</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Descripción</h4>
                      <p className="whitespace-pre-wrap">{event.description}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Descripción corta</h4>
                      <p className="text-sm text-muted-foreground">{event.short_description}</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Detalles */}
            <div className="bg-card border rounded-lg p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-moto-orange" />
                Detalles
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="text-sm text-muted-foreground">Fecha inicio</label>
                      <input
                        type="date"
                        name="start_date"
                        value={editedEvent.start_date?.split('T')[0] || ''}
                        onChange={handleInputChange}
                        className={`w-full mt-1 p-2 border rounded-md bg-background ${
                          getFieldError('start_date') ? 'border-red-500' : ''
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Fecha fin</label>
                      <input
                        type="date"
                        name="end_date"
                        value={editedEvent.end_date?.split('T')[0] || ''}
                        onChange={handleInputChange}
                        className="w-full mt-1 p-2 border rounded-md bg-background"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Ciudad</label>
                      <input
                        type="text"
                        name="location_city"
                        value={editedEvent.location_city || ''}
                        onChange={handleInputChange}
                        className={`w-full mt-1 p-2 border rounded-md bg-background ${
                          getFieldError('location_city') ? 'border-red-500' : ''
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Lugar</label>
                      <input
                        type="text"
                        name="location_name"
                        value={editedEvent.location_name || ''}
                        onChange={handleInputChange}
                        className={`w-full mt-1 p-2 border rounded-md bg-background ${
                          getFieldError('location_name') ? 'border-red-500' : ''
                        }`}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span className="text-sm text-muted-foreground">Fecha inicio</span>
                      <p className="font-medium">{new Date(event.start_date).toLocaleDateString('es-ES')}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Fecha fin</span>
                      <p className="font-medium">
                        {event.end_date ? new Date(event.end_date).toLocaleDateString('es-ES') : 'Mismo día'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Ciudad</span>
                      <p className="font-medium">{event.location_city}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Lugar</span>
                      <p className="font-medium">{event.location_name}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Botones de guardar/cancelar */}
            {isEditing && (
              <div className="flex gap-4 sticky bottom-4">
                <button
                  onClick={saveEdits}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-3 rounded-md bg-moto-orange text-white font-medium hover:bg-moto-orange-dark transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Guardando...' : '💾 Guardar Cambios'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedEvent(event);
                    setValidationErrors([]);
                  }}
                  className="flex-1 px-4 py-3 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-card border rounded-lg p-6">
              <h4 className="font-semibold mb-4">Quick Actions</h4>
              
              {!isEditing ? (
                <div className="space-y-3">
                  {(event.status === 'pending' || event.status === 'needs_edit') && (
                    <>
                      <button
                        onClick={() => updateStatus('approved')}
                        disabled={actionLoading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Aprobar y Publicar
                      </button>
                      
                      <button
                        onClick={() => setIsEditing(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                      >
                        <Edit3 className="w-5 h-5" />
                        Editar Evento
                      </button>
                      
                      <button
                        onClick={() => setShowRejectModal(true)}
                        disabled={actionLoading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-5 h-5" />
                        Rechazar
                      </button>
                    </>
                  )}
                  
                  {event.status === 'approved' && (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                      >
                        <Edit3 className="w-5 h-5" />
                        Editar Evento
                      </button>
                      
                      <button
                        onClick={() => setShowRejectModal(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="w-5 h-5" />
                        Descartar
                      </button>
                    </>
                  )}
                  
                  {event.status === 'rejected' && (
                    <button
                      onClick={() => updateStatus('pending')}
                      disabled={actionLoading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-yellow-600 text-white font-medium hover:bg-yellow-700 transition-colors disabled:opacity-50"
                    >
                      <Clock className="w-5 h-5" />
                      Restaurar
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-sm text-center text-muted-foreground p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-md">
                  Modo edición activo. Guarda o cancela para realizar otras acciones.
                </p>
              )}
            </div>

            {/* Info Organizador */}
            <div className="bg-card border rounded-lg p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-moto-orange" />
                Organizador
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Nombre:</span>
                  <p className="font-medium">{event.organizer_name}</p>
                </div>
                {event.organizer_email && (
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p className="font-medium">{event.organizer_email}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Historial */}
            {event.moderated_at && (
              <div className="bg-card border rounded-lg p-6">
                <h4 className="font-semibold mb-4">Historial</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Última moderación</p>
                      <p className="text-xs">{new Date(event.moderated_at).toLocaleString('es-ES')}</p>
                    </div>
                  </div>
                  {event.rejection_reason && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                      <p className="text-xs text-red-800 dark:text-red-300">
                        <strong>Motivo rechazo:</strong> {event.rejection_reason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Preview */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPreview(false)}>
          <div className="bg-card rounded-lg max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Preview - Cómo se verá en el calendario</h3>
              <button onClick={() => setShowPreview(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <div className="p-4">
              {/* Event Card Preview */}
              <div 
                className="aspect-video rounded-lg overflow-hidden relative cursor-pointer group"
                style={{
                  backgroundImage: `url(${editedEvent.featured_image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 70%, transparent 100%)'
                }} />
                <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                  <h4 className="font-bold text-base line-clamp-2 mb-2">{editedEvent.title}</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                      <MapPin className="w-3 h-3" />
                      <span>{editedEvent.location_city}</span>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 ring-0 group-hover:ring-2 group-hover:ring-moto-orange/50 ring-inset transition-all" />
              </div>
              <p className="text-xs text-center text-muted-foreground mt-4">
                Así aparecerá en el calendario una vez aprobado
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Rechazo */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">¿Por qué rechazas este evento?</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Escribe el motivo del rechazo..."
              className="w-full px-3 py-2 border rounded-md mb-4 min-h-[100px] bg-background"
            />
            <div className="flex gap-3">
              <button
                onClick={() => updateStatus('rejected', rejectionReason)}
                disabled={!rejectionReason || actionLoading}
                className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading ? 'Procesando...' : 'Confirmar'}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                className="flex-1 bg-muted py-2 rounded-md hover:bg-muted/80"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
