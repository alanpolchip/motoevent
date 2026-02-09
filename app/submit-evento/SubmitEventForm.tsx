'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export function SubmitEventForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const eventData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      short_description: formData.get('short_description') as string,
      start_date: formData.get('start_date') as string,
      end_date: formData.get('end_date') as string || null,
      location_name: formData.get('location_name') as string,
      location_city: formData.get('location_city') as string,
      organizer_name: formData.get('organizer_name') as string,
      event_type: formData.get('event_type') as string,
      featured_image: formData.get('featured_image') as string,
    };

    try {
      const response = await fetch('/api/eventos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el evento');
      }

      setSubmitStatus('success');
      // Reset form
      form.reset();
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          ¡Evento enviado correctamente!
        </h3>
        <p className="text-muted-foreground mb-4">
          Tu evento ha sido enviado para revisión. Será publicado después de ser aprobado por nuestro equipo.
        </p>
        <p className="text-sm text-muted-foreground">
          Serás redirigido al calendario en unos segundos...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-red-800">Error al enviar el evento</h4>
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Título del evento */}
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Título del evento <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Ej: Concentración Motera Kando"
          className="w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-moto-orange/20 focus:border-moto-orange"
          required
        />
      </div>

      {/* Descripción */}
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Descripción completa <span className="text-xs text-muted-foreground">(opcional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          placeholder="Describe tu evento con detalle..."
          className="w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-moto-orange/20 focus:border-moto-orange resize-none"
        />
      </div>

      {/* Descripción corta */}
      <div className="space-y-2">
        <label htmlFor="short_description" className="text-sm font-medium">
          Descripción corta <span className="text-xs text-muted-foreground">(opcional)</span>
        </label>
        <input
          type="text"
          id="short_description"
          name="short_description"
          placeholder="Breve resumen para el calendario"
          className="w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-moto-orange/20 focus:border-moto-orange"
        />
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="start_date" className="text-sm font-medium">
            Fecha de inicio <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            className="w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-moto-orange/20 focus:border-moto-orange"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="end_date" className="text-sm font-medium">
            Fecha de fin <span className="text-xs text-muted-foreground">(opcional)</span>
          </label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            className="w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-moto-orange/20 focus:border-moto-orange"
          />
        </div>
      </div>

      {/* Ubicación */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="location_name" className="text-sm font-medium">
            Nombre del lugar <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="location_name"
            name="location_name"
            placeholder="Ej: Recinto Ferial de Valladolid"
            className="w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-moto-orange/20 focus:border-moto-orange"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="location_city" className="text-sm font-medium">
            Ciudad <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="location_city"
            name="location_city"
            placeholder="Ej: Valladolid"
            className="w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-moto-orange/20 focus:border-moto-orange"
            required
          />
        </div>
      </div>

      {/* Organizador */}
      <div className="space-y-2">
        <label htmlFor="organizer_name" className="text-sm font-medium">
          Nombre del organizador <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="organizer_name"
          name="organizer_name"
          placeholder="Ej: Moto Club Kando"
          className="w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-moto-orange/20 focus:border-moto-orange"
          required
        />
      </div>

      {/* Tipo de evento */}
      <div className="space-y-2">
        <label htmlFor="event_type" className="text-sm font-medium">
          Tipo de evento
        </label>
        <select
          id="event_type"
          name="event_type"
          className="w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-moto-orange/20 focus:border-moto-orange"
        >
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

      {/* Imagen */}
      <div className="space-y-2">
        <label htmlFor="featured_image" className="text-sm font-medium">
          URL de imagen principal <span className="text-xs text-muted-foreground">(opcional)</span>
        </label>
        <input
          type="url"
          id="featured_image"
          name="featured_image"
          placeholder="https://ejemplo.com/imagen.jpg"
          className="w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-moto-orange/20 focus:border-moto-orange"
        />
        <p className="text-xs text-muted-foreground">
          Proporciona una URL de imagen representativa de tu evento
        </p>
      </div>

      {/* Botón de envío */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-moto-orange hover:bg-moto-orange-dark text-white font-medium py-2.5 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Enviando...
            </>
          ) : (
            'Enviar evento para revisión'
          )}
        </button>
        <p className="text-xs text-muted-foreground text-center mt-3">
          Tu evento será revisado antes de aparecer en el calendario
        </p>
      </div>
    </form>
  );
}
