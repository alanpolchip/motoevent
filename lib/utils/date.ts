import { format, parseISO, isSameDay, isAfter, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea una fecha para mostrar al usuario
 */
export function formatDate(date: string | Date, formatStr: string = 'dd MMMM yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatStr, { locale: es });
}

/**
 * Formatea rango de fechas de evento
 */
export function formatDateRange(startDate: string, endDate?: string): string {
  const start = parseISO(startDate);
  
  if (!endDate || isSameDay(start, parseISO(endDate))) {
    return format(start, "d 'de' MMMM yyyy", { locale: es });
  }
  
  const end = parseISO(endDate);
  
  // Mismo mes
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${format(start, 'd', { locale: es })} - ${format(end, "d 'de' MMMM yyyy", { locale: es })}`;
  }
  
  // Diferente mes
  return `${format(start, "d 'de' MMMM", { locale: es })} - ${format(end, "d 'de' MMMM yyyy", { locale: es })}`;
}

/**
 * Formatea hora
 */
export function formatTime(time: string): string {
  // time viene como "HH:mm:ss" o "HH:mm"
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
}

/**
 * Genera fecha en formato ISO para inputs datetime-local
 */
export function toDateTimeLocal(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm");
}

/**
 * Verifica si un evento es futuro
 */
export function isUpcomingEvent(startDate: string): boolean {
  const start = parseISO(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return isAfter(start, today) || isSameDay(start, today);
}

/**
 * Verifica si un evento ha pasado
 */
export function isPastEvent(endDate?: string, startDate?: string): boolean {
  const dateToCheck = endDate ? parseISO(endDate) : startDate ? parseISO(startDate) : null;
  if (!dateToCheck) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return isBefore(dateToCheck, today);
}

/**
 * Genera URL para Google Calendar
 */
export function generateGoogleCalendarUrl(event: {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
}): string {
  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  
  const params = new URLSearchParams({
    text: event.title,
    details: event.description,
    location: event.location,
  });
  
  // Formato de fechas para Google Calendar: YYYYMMDDTHHMMSSZ
  const formatGCalDate = (date: string, time?: string): string => {
    const d = parseISO(date);
    const dateStr = format(d, 'yyyyMMdd');
    
    if (time) {
      const [hours, minutes] = time.split(':');
      return `${dateStr}T${hours}${minutes}00`;
    }
    
    return dateStr;
  };
  
  const start = formatGCalDate(event.startDate, event.startTime);
  const end = event.endDate 
    ? formatGCalDate(event.endDate, event.endTime)
    : formatGCalDate(event.startDate, event.endTime);
  
  params.append('dates', `${start}/${end}`);
  
  return `${baseUrl}&${params.toString()}`;
}
