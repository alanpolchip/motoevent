# 🏍️ PLAN DE ATAQUE - MotoEvents Calendar PWA

## 📋 Visión General del Proyecto

**Nombre del Proyecto:** MotoEvents Calendar  
**Versión:** MVP 1.0  
**Stack Principal:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase  
**Objetivo:** Ser el calendario de eventos moteros de referencia en España y Latinoamérica

---

## 🏗️ Arquitectura del Sistema

### 1. Estructura de Carpetas (Next.js App Router)

```
my-app/
├── app/                          # App Router de Next.js
│   ├── (landing)/                # Grupo de rutas - Landing
│   │   ├── page.tsx              # Página principal con calendario
│   │   └── layout.tsx            # Layout específico de landing
│   ├── eventos/                  # Rutas dinámicas de eventos (SEO CRITICAL)
│   │   └── [slug]/               # Slug único por evento
│   │       ├── page.tsx          # Página de detalle del evento
│   │       └── opengraph-image.tsx  # OG Image dinámico
│   ├── api/                      # API Routes (Serverless)
│   │   ├── eventos/              
│   │   │   ├── route.ts          # CRUD de eventos
│   │   │   └── [slug]/
│   │   │       └── route.ts      # Evento específico
│   │   ├── auth/
│   │   │   └── [...nextauth]/    # Auth con NextAuth.js
│   │   └── admin/
│   │       └── pending-events/   # Endpoint para moderación
│   ├── admin/                    # Panel de administración (protegido)
│   │   ├── layout.tsx            # Layout con auth check
│   │   ├── page.tsx              # Dashboard admin
│   │   └── moderacion/           
│   │       └── page.tsx          # Lista de eventos pendientes
│   ├── submit-evento/            # Formulario UGC
│   │   └── page.tsx
│   ├── layout.tsx                # Root layout (metadata global)
│   ├── globals.css               # Estilos globales + Tailwind
│   └── not-found.tsx             # 404 personalizada
├── components/                   # Componentes React reutilizables
│   ├── ui/                       # Componentes base (shadcn/ui)
│   ├── calendar/                 # Componentes del calendario
│   │   ├── MotoCalendar.tsx      # Calendario principal
│   │   ├── CalendarCell.tsx      # Celda de día con imagen
│   │   ├── ViewToggle.tsx        # Toggle mensual/semanal
│   │   └── EventOverlay.tsx      # Overlay de texto sobre imagen
│   ├── event/                    # Componentes de eventos
│   │   ├── EventCard.tsx
│   │   ├── EventDetail.tsx
│   │   ├── GoogleCalendarButton.tsx
│   │   └── ShareButtons.tsx
│   ├── forms/                    # Formularios
│   │   ├── EventSubmissionForm.tsx
│   │   └── AdminLoginForm.tsx
│   └── seo/                      # Componentes SEO
│       ├── JsonLd.tsx            # Structured data
│       └── MetaTags.tsx
├── lib/                          # Utilidades y configuraciones
│   ├── supabase/                 
│   │   ├── client.ts             # Cliente Supabase (browser)
│   │   ├── server.ts             # Cliente Supabase (server)
│   │   └── admin.ts              # Cliente con service role
│   ├── utils/
│   │   ├── cn.ts                 # Merge de clases Tailwind
│   │   ├── date.ts               # Utilidades de fecha
│   │   ├── slug.ts               # Generación de slugs
│   │   └── seo.ts                # Helpers SEO
│   └── constants.ts              # Constantes de la app
├── hooks/                        # Custom React Hooks
│   ├── useEvents.ts              # Fetch de eventos
│   ├── useAuth.ts                # Autenticación
│   └── useCalendarView.ts        # Estado de vista del calendario
├── types/                        # TypeScript Definitions
│   ├── event.ts                  # Tipos de eventos
│   ├── user.ts                   # Tipos de usuario
│   └── database.ts               # Tipos de Supabase
├── public/                       # Assets estáticos
│   ├── images/
│   │   ├── events/               # Imágenes de eventos (uploads)
│   │   ├── placeholders/         # Imágenes por defecto
│   │   └── og-default.jpg        # OG Image por defecto
│   ├── icons/                    # Iconos PWA
│   ├── manifest.json             # Manifest PWA
│   └── robots.txt                # Robots.txt
├── scripts/                      # Scripts de utilidad
│   └── generate-sitemap.ts       # Generador de sitemap
├── middleware.ts                 # Middleware de Next.js (auth, redirects)
├── next.config.js                # Configuración Next.js
├── tailwind.config.ts            # Configuración Tailwind
├── tsconfig.json                 # Configuración TypeScript
└── package.json
```

---

## 🗄️ Arquitectura de Base de Datos (Supabase PostgreSQL)

### Tablas Principales

#### 1. `profiles` (Usuarios extendidos)
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2. `events` (Eventos - Tabla Principal)
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,                    -- URL amigable: "concentracion-pingüinos-2024"
  title TEXT NOT NULL,                          -- Título del evento
  description TEXT,                             -- Descripción completa
  short_description TEXT,                       -- Para tarjetas/celdas (max 150 chars)
  
  -- Fechas
  start_date DATE NOT NULL,                     -- Fecha de inicio
  end_date DATE,                                -- Fecha de fin (opcional)
  start_time TIME,                              -- Hora de inicio
  end_time TIME,                                -- Hora de fin
  
  -- Ubicación
  location_name TEXT NOT NULL,                  -- Nombre del lugar
  location_address TEXT,                        -- Dirección completa
  location_city TEXT,                           -- Ciudad
  location_country TEXT DEFAULT 'España',       -- País
  latitude DECIMAL(10, 8),                      -- Coordenadas para mapa
  longitude DECIMAL(11, 8),
  
  -- Organizador
  organizer_name TEXT,                          -- Nombre del organizador
  organizer_email TEXT,                         -- Contacto
  organizer_phone TEXT,
  organizer_website TEXT,
  organizer_instagram TEXT,
  organizer_facebook TEXT,
  
  -- Imágenes
  featured_image TEXT NOT NULL,                 -- URL imagen principal (para celda)
  gallery_images TEXT[],                        -- Array de URLs para galería
  
  -- Categorización
  event_type TEXT DEFAULT 'concentracion' CHECK (event_type IN (
    'concentracion', 'ruta', 'competicion', 'feria', 
    'taller', 'quedada', 'benefico', 'otro'
  )),
  motorcycle_types TEXT[],                      -- ['custom', 'trail', 'sport', 'vintage', 'todas']
  tags TEXT[],                                  -- Tags para búsqueda
  
  -- SEO
  meta_title TEXT,                              -- Título SEO (< 60 chars)
  meta_description TEXT,                        -- Descripción SEO (< 160 chars)
  
  -- Estado y Moderación
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  submitted_by UUID REFERENCES profiles(id),    -- Usuario que lo envió (NULL si admin)
  moderated_by UUID REFERENCES profiles(id),    -- Moderador que aprobó
  moderated_at TIMESTAMPTZ,
  rejection_reason TEXT,                        -- Razón de rechazo
  
  -- Métricas
  view_count INTEGER DEFAULT 0,
  added_to_calendar_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Índices para SEO y búsqueda
  CONSTRAINT valid_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

-- Índices críticos para performance
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_dates ON events(start_date, end_date);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_location ON events(location_city, location_country);
CREATE INDEX idx_events_tags ON events USING GIN(tags);
```

#### 3. `event_favorites` (Favoritos de usuarios - Feature futura)
```sql
CREATE TABLE event_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);
```

#### 4. `event_views` (Analytics - Feature futura)
```sql
CREATE TABLE event_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_hash TEXT,                                 -- Hash de IP para unicidad aproximada
  user_agent TEXT,
  referrer TEXT
);
```

### Row Level Security (RLS) Policies

```sql
-- Events: Lectura pública solo de aprobados
CREATE POLICY "Events are viewable by everyone" ON events
  FOR SELECT USING (status = 'approved');

-- Events: Inserción por usuarios autenticados (quedan en pending)
CREATE POLICY "Authenticated users can submit events" ON events
  FOR INSERT TO authenticated WITH CHECK (true);

-- Events: Solo admins pueden actualizar/eliminar
CREATE POLICY "Only admins can update events" ON events
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
  );
```

---

## 🔄 Flujo de Datos

### 1. Flujo de Publicación de Evento (UGC + Moderación)

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Usuario       │────▶│  Formulario UGC  │────▶│  Supabase DB    │
│  (Autenticado   │     │  /submit-evento  │     │  status:pending │
│   o Anónimo)    │     │                  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                           │
                            ┌───────────────────────────────┘
                            ▼
                     ┌─────────────────┐
                     │  Notificación   │
                     │  al Moderador   │
                     │  (Email/Panel)  │
                     └─────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    PANEL DE MODERACIÓN (/moderar)                   │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │ Por Revisar  │  │ Por Modificar│  │  Validados   │  │Descartados│ │
│  │  (pending)   │  │ (needs_edit) │  │  (approved)  │  │(rejected) │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────┘ │
│                                                                     │
│  Acciones disponibles:                                              │
│  ✅ Validar y Publicar  →  Cambia status a 'approved'               │
│  ✏️ Modificar Parámetros → Edita campos antes de validar            │
│  ❌ Rechazar Evento     →  Cambia status a 'rejected' + motivo      │
└─────────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Evento visible │◀────│  Aprobación      │◀────│  Revisión       │
│  en calendario  │     │  status:approved │     │  del moderador  │
│  + Página SEO   │     │                  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### Estados de Moderación

| Estado | Descripción | Acciones Posibles |
|--------|-------------|-------------------|
| `pending` | Evento recién enviado, esperando revisión | Ver detalle, Validar, Modificar, Rechazar |
| `needs_edit` | Necesita correcciones antes de publicar | Ver detalle, Modificar, Rechazar |
| `approved` | Evento validado y visible en el calendario | Ver detalle, Editar, Descartar |
| `rejected` | Evento descartado, no se publica | Ver detalle, Restaurar |

### Flujo de Estados

```
                    ┌─────────────┐
         ┌─────────▶│   pending   │◀────────┐
         │          │ (Por Revisar)│         │
         │          └──────┬──────┘         │
         │                 │                │
    ┌────┴────┐       ┌────┴────┐      ┌────┴────┐
    │rejected │◀──────│modificar│      │approved │
    │(Descart)│       │(needs_ed)│      │(Validado)│
    └────┬────┘       └────┬────┘      └────┬────┘
         │                 │                │
         │                 ▼                │
         │          ┌─────────────┐         │
         └─────────▶│  pending    │◀────────┘
                    │  (revisar)  │
                    └─────────────┘
```

### 2. Flujo de Renderizado SEO (Server-Side)

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Bot Google    │────▶│  /eventos/[slug] │────▶│  Server Component│
│   o Usuario     │     │                  │     │  Next.js 14     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                           │
                           ┌───────────────────────────────┘
                           ▼
                    ┌─────────────────┐
                    │  Fetch evento   │
                    │  Supabase SSR   │
                    └─────────────────┘
                           │
                           ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Generación     │────▶│  Metadata dyn    │────▶│  HTML completo  │
│  OpenGraph      │     │  (title, desc,   │     │  + JSON-LD      │
│  Image dyn      │     │  og:image, etc)  │     │  Structured Data│
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### 3. Flujo de Datos del Calendario (Client-Side)

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Usuario       │────▶│  Landing Page    │────▶│  Client Component│
│   entra a /     │     │  page.tsx        │     │  MotoCalendar   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                           │
                           ┌───────────────────────────────┘
                           ▼
                    ┌─────────────────┐
                    │  useEffect fetch│
                    │  /api/eventos   │
                    └─────────────────┘
                           │
                           ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  FullCalendar   │────▶│  Render celdas   │────▶│  EventOverlay   │
│  React          │     │  con imagen bg   │     │  (texto + btn)  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

---

## 📱 Estrategia PWA

### Manifest.json
```json
{
  "name": "MotoEvents Calendar - Eventos Moteros",
  "short_name": "MotoEvents",
  "description": "El calendario de eventos moteros de referencia",
  "start_url": "/",
  "display": "standalone",
  "background_color":="#1a1a1a",
  "theme_color": "#ff6b00",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192" },
    { "src": "/icons/icon-512.png", "sizes": "512x512" }
  ]
}
```

### Service Worker (next-pwa)
- Cache de assets estáticos
- Estrategia "Stale While Revalidate" para eventos
- Notificaciones push para nuevos eventos (futuro)

---

## 🔍 Estrategia SEO

### 1. Metadata Dinámica por Página

**Landing Page (/):**
- Title: "MotoEvents Calendar | El Calendario de Eventos Moteros 2024"
- Description: "Descubre todas las concentraciones, rutas y quedadas moteras. El calendario más completo de eventos para motociclistas en España."
- Keywords: eventos moteros, calendario motero, concentraciones moto, rutas moto

**Página de Evento (/eventos/[slug]):**
- Title: "{event.title} | {event.location_city} | MotoEvents"
- Description: "{event.short_description}"
- OG Image: Imagen dinámica generada con datos del evento
- JSON-LD: Event schema de Schema.org

### 2. URLs Amigables (Slugs)
- Formato: `/eventos/{nombre-evento-ciudad-año}`
- Ejemplo: `/eventos/concentracion-pingüinos-2024`
- Generación automática desde título + ciudad + año

### 3. Open Graph & Twitter Cards Dinámicas
- Imagen OG generada dinámicamente con:
  - Imagen del evento de fondo
  - Título y fecha superpuestos
  - Branding MotoEvents

### 4. Structured Data (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Concentración Pingüinos 2024",
  "startDate": "2024-07-12T10:00:00",
  "endDate": "2024-07-14T20:00:00",
  "location": {
    "@type": "Place",
    "name": "Valladolid",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Valladolid",
      "addressCountry": "ES"
    }
  },
  "image": "https://...",
  "description": "...",
  "organizer": {
    "@type": "Organization",
    "name": "..."
  }
}
```

### 5. Sitemap.xml Dinámico
- Generación automática de sitemap con todos los eventos aprobados
- Actualización diaria mediante cron job o webhook

---

## 🛡️ Estrategia de Autenticación

### Opción A: Supabase Auth (Recomendada)
- Email + Password
- OAuth (Google, Facebook)
- Magic Link (email sin password)
- Row Level Security integrado

### Opción B: NextAuth.js (si necesitamos más providers)
- Configuración más flexible
- Múltiples providers OAuth
- Requiere tabla de sesiones personalizada

### Roles de Usuario
- `user`: Puede ver eventos y enviar propuestas
- `moderator`: Puede aprobar/rechazar eventos
- `admin`: Control total + gestión de usuarios

---

## 📦 Dependencias Principales

```json
{
  "dependencies": {
    "next": "^14.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "typescript": "^5.x",
    
    "@supabase/supabase-js": "^2.x",
    "@supabase/auth-helpers-nextjs": "^0.x",
    
    "@fullcalendar/react": "^6.x",
    "@fullcalendar/core": "^6.x",
    "@fullcalendar/daygrid": "^6.x",
    "@fullcalendar/timegrid": "^6.x",
    "@fullcalendar/interaction": "^6.x",
    
    "tailwindcss": "^3.x",
    "@radix-ui/react-*": "varios",
    "class-variance-authority": "^0.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x",
    
    "next-pwa": "^5.x",
    "next-sitemap": "^4.x",
    
    "react-hook-form": "^7.x",
    "zod": "^3.x",
    "@hookform/resolvers": "^3.x",
    
    "date-fns": "^3.x",
    "react-map-gl": "^7.x",
    "mapbox-gl": "^3.x"
  }
}
```

---

## 🚀 Estrategia de Despliegue

### Entorno de Desarrollo
```bash
npm run dev        # localhost:3000
```

### Build de Producción
```bash
npm run build      # Genera .next/
npm run start      # Servidor de producción
```

### Variables de Entorno (.env.local)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# App
NEXT_PUBLIC_APP_URL=https://motoevents.com
NEXT_PUBLIC_APP_NAME=MotoEvents Calendar

# Mapbox (para mapas)
NEXT_PUBLIC_MAPBOX_TOKEN=pk...

# Admin (para crear primer admin)
ADMIN_SECRET_KEY=super-secret-key
```

### Plataformas de Despliegue
1. **Vercel** (Recomendado): SSR nativo, edge functions, analytics
2. **Netlify**: También compatible con Next.js 14
3. **Railway/Render**: Si necesitamos más control del servidor

---

## 📊 Métricas de Éxito (KPIs)

### Técnicos
- Lighthouse Score > 90 (Performance, SEO, Accessibility)
- Time to First Byte (TTFB) < 200ms
- First Contentful Paint (FCP) < 1.8s

### Negocio
- Eventos publicados/mes
- Tráfico orgánico (SEO)
- Tasas de conversión (submit evento)
- Eventos añadidos a Google Calendar

---

## 🎯 Roadmap Post-MVP

### Fase 2 (1-2 meses)
- [ ] Filtros avanzados (tipo moto, distancia, tipo evento)
- [ ] Sistema de favoritos para usuarios
- [ ] Notificaciones push de eventos cercanos
- [ ] Integración con Google Maps para rutas

### Fase 3 (2-3 meses)
- [ ] App móvil (React Native o PWA avanzada)
- [ ] Sistema de reviews/comentarios en eventos
- [ ] Venta de entradas (integración Stripe)
- [ ] Publicidad patrocinada para eventos

---

## ⚠️ Consideraciones Técnicas

### Optimización de Imágenes
- Uso de `next/image` para optimización automática
- WebP/AVIF con fallback
- Lazy loading de imágenes del calendario
- CDN para assets (Cloudflare o Supabase Storage CDN)

### Caché y Performance
- ISR (Incremental Static Regeneration) para páginas de evento
- Cache de API routes con revalidate
- React Server Components para reducir JS bundle

### Seguridad
- Sanitización de inputs (XSS protection)
- Rate limiting en API routes
- Validación de archivos subidos (imágenes)
- CSP (Content Security Policy)

---

**Arquitecto:** Kimi (AI Senior Software Architect)  
**Fecha:** 2024-01-30  
**Versión:** 1.0
