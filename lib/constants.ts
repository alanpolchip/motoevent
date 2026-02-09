// ============================================
// CONSTANTES DE LA APLICACIÓN
// ============================================

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'MotoEvents Calendar';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Tipos de eventos
export const EVENT_TYPES = [
  { value: 'concentracion', label: 'Concentración', icon: 'users' },
  { value: 'ruta', label: 'Ruta', icon: 'route' },
  { value: 'competicion', label: 'Competición', icon: 'trophy' },
  { value: 'feria', label: 'Feria/Exposición', icon: 'store' },
  { value: 'taller', label: 'Taller/Formación', icon: 'wrench' },
  { value: 'quedada', label: 'Quedada informal', icon: 'coffee' },
  { value: 'benefico', label: 'Evento benéfico', icon: 'heart' },
  { value: 'otro', label: 'Otro', icon: 'calendar' },
] as const;

// Tipos de motocicletas
export const MOTORCYCLE_TYPES = [
  { value: 'custom', label: 'Custom/Chopper' },
  { value: 'trail', label: 'Trail/Adventure' },
  { value: 'sport', label: 'Sport' },
  { value: 'naked', label: 'Naked' },
  { value: 'vintage', label: 'Clásica/Vintage' },
  { value: 'scooter', label: 'Scooter' },
  { value: 'todas', label: 'Todas las motos' },
] as const;

// Países soportados (para el selector)
export const COUNTRIES = [
  { value: 'España', label: 'España' },
  { value: 'México', label: 'México' },
  { value: 'Argentina', label: 'Argentina' },
  { value: 'Colombia', label: 'Colombia' },
  { value: 'Chile', label: 'Chile' },
  { value: 'Perú', label: 'Perú' },
  { value: 'Uruguay', label: 'Uruguay' },
  { value: 'Paraguay', label: 'Paraguay' },
  { value: 'Bolivia', label: 'Bolivia' },
  { value: 'Ecuador', label: 'Ecuador' },
  { value: 'Venezuela', label: 'Venezuela' },
  { value: 'Costa Rica', label: 'Costa Rica' },
  { value: 'Panamá', label: 'Panamá' },
  { value: 'Guatemala', label: 'Guatemala' },
  { value: 'Otro', label: 'Otro' },
] as const;

// Configuración de paginación
export const PAGINATION = {
  EVENTS_PER_PAGE: 12,
  ADMIN_EVENTS_PER_PAGE: 20,
} as const;

// Configuración de imágenes
export const IMAGES = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_GALLERY_IMAGES: 5,
  THUMBNAIL_WIDTH: 400,
  FEATURED_WIDTH: 1200,
} as const;

// SEO Defaults
export const SEO = {
  DEFAULT_TITLE: `${APP_NAME} | El Calendario de Eventos Moteros`,
  DEFAULT_DESCRIPTION: 'Descubre todas las concentraciones, rutas, quedadas y eventos moteros. El calendario más completo para motociclistas.',
  DEFAULT_KEYWORDS: 'eventos moteros, calendario moto, concentraciones moto, rutas moto, quedadas moteras',
  OG_IMAGE_WIDTH: 1200,
  OG_IMAGE_HEIGHT: 630,
  TWITTER_HANDLE: '@motoevents',
} as const;

// Rutas de la aplicación
export const ROUTES = {
  HOME: '/',
  EVENTS: '/eventos',
  SUBMIT_EVENT: '/submit-evento',
  ADMIN: '/admin',
  ADMIN_MODERATION: '/admin/moderacion',
  LOGIN: '/login',
  REGISTER: '/register',
} as const;
