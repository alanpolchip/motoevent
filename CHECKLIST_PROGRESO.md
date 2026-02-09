# ✅ CHECKLIST DE PROGRESO - MotoEvents Calendar PWA

## Leyenda
- [ ] Pendiente
- [~] En progreso
- [x] Completado
- [!] Bloqueado/Issue

---

## FASE 1: SETUP Y CONFIGURACIÓN INICIAL

### 1.1 Entorno de Desarrollo
- [ ] **1.1.1** Crear proyecto Next.js 14 con App Router
- [ ] **1.1.2** Configurar TypeScript con tsconfig.json estricto
- [ ] **1.1.3** Instalar y configurar Tailwind CSS
- [ ] **1.1.4** Instalar shadcn/ui y componentes base
- [ ] **1.1.5** Configurar ESLint y Prettier
- [ ] **1.1.6** Configurar path aliases (@/components, @/lib, etc.)
- [ ] **1.1.7** Crear estructura de carpetas del proyecto

### 1.2 Supabase Setup
- [ ] **1.2.1** Crear proyecto en Supabase
- [ ] **1.2.2** Configurar variables de entorno (.env.local)
- [ ] **1.2.3** Crear cliente Supabase para browser (lib/supabase/client.ts)
- [ ] **1.2.4** Crear cliente Supabase para server (lib/supabase/server.ts)
- [ ] **1.2.5** Crear cliente Supabase admin (lib/supabase/admin.ts)
- [ ] **1.2.6** Ejecutar migraciones SQL (tablas y RLS)
- [ ] **1.2.7** Configurar Storage bucket para imágenes de eventos
- [ ] **1.2.8** Crear tipos TypeScript de la base de datos

### 1.3 Configuración PWA
- [ ] **1.3.1** Instalar next-pwa
- [ ] **1.3.2** Crear manifest.json
- [ ] **1.3.3** Configurar next.config.js para PWA
- [ ] **1.3.4** Crear iconos PWA (192x192, 512x512)
- [ ] **1.3.5** Configurar service worker personalizado (opcional)

---

## FASE 2: DISEÑO Y UI COMPONENTS

### 2.1 Sistema de Diseño
- [ ] **2.1.1** Definir paleta de colores (tema motero: naranja, negro, gris)
- [ ] **2.1.2** Configurar tailwind.config.ts con colores custom
- [ ] **2.1.3** Configurar tipografías (Google Fonts)
- [ ] **2.1.4** Crear variables CSS globales
- [ ] **2.1.5** Definir breakpoints responsive

### 2.2 Componentes UI Base (shadcn/ui)
- [ ] **2.2.1** Instalar Button con variantes custom
- [ ] **2.2.2** Instalar Card component
- [ ] **2.2.3** Instalar Dialog/Modal component
- [ ] **2.2.4** Instalar Form components (Input, Textarea, Select)
- [ ] **2.2.5** Instalar Badge component
- [ ] **2.2.6** Instalar Tabs component
- [ ] **2.2.7** Instalar Toast/Notification component
- [ ] **2.2.8** Instalar Skeleton component (loading states)

### 2.3 Layouts
- [ ] **2.3.1** Crear Root Layout con metadata global
- [ ] **2.3.2** Crear Header/Navbar component
- [ ] **2.3.3** Crear Footer component
- [ ] **2.3.4** Crear Layout de Landing Page
- [ ] **2.3.5** Crear Layout de Admin (con protección)

---

## FASE 3: SISTEMA DE AUTENTICACIÓN

### 3.1 Configuración Auth
- [x] **3.1.1** Configurar Supabase Auth (migraciones SQL)
- [ ] **3.1.2** Crear contexto de autenticación
- [ ] **3.1.3** Crear hook useAuth
- [x] **3.1.4** Crear middleware.ts para protección de rutas

### 3.2 Páginas de Auth
- [ ] **3.2.1** Crear página de Login
- [ ] **3.2.2** Crear página de Registro
- [ ] **3.2.3** Crear página de Recuperar Contraseña
- [ ] **3.2.4** Crear página de Magic Link (opcional)

### 3.3 Perfiles de Usuario
- [x] **3.3.1** Crear trigger para crear perfil al registrarse (en migrations.sql)
- [ ] **3.3.2** Crear página de perfil de usuario
- [x] **3.3.3** Implementar roles (user, moderator, admin) (en migrations.sql)

---

## FASE 4: CALENDARIO PRINCIPAL (LANDING PAGE)

### 4.1 Integración FullCalendar
- [x] **4.1.1** Instalar FullCalendar React (en package.json)
- [x] **4.1.2** Configurar plugins (daygrid, timegrid, interaction)
- [x] **4.1.3** Crear componente EventCalendar principal
- [x] **4.1.4** Implementar vista Mensual
- [x] **4.1.5** Implementar vista Semanal
- [x] **4.1.6** Crear toggle de vistas (Mensual/Semanal)

### 4.2 Diseño de Celdas de Evento
- [x] **4.2.1** Crear componente CalendarCell (renderEventContent)
- [x] **4.2.2** Implementar imagen de fondo en celda
- [x] **4.2.3** Crear overlay de texto con contraste
- [x] **4.2.4** Mostrar: Título, Día, Lugar
- [~] **4.2.5** Estilos responsive para móvil
- [~] **4.2.6** Manejar múltiples eventos en mismo día

### 4.3 Interacciones del Calendario
- [x] **4.3.1** Implementar clic en evento (navegar a detalle)
- [~] **4.3.2** Crear botón "Añadir a Google Calendar" (función creada)
- [x] **4.3.3** Generar URL de Google Calendar
- [~] **4.3.4** Implementar hover effects
- [x] **4.3.5** Implementar navegación entre meses/semanas

### 4.4 Fetch de Datos
- [ ] **4.4.1** Crear hook useEvents
- [x] **4.4.2** Implementar fetch de eventos aprobados (API route)
- [~] **4.4.3** Filtrar por rango de fechas visibles
- [x] **4.4.4** Implementar estados de loading
- [~] **4.4.5** Manejar errores de fetch

---

## FASE 5: PÁGINA DE DETALLE DEL EVENTO (SEO CRITICAL)

### 5.1 Estructura de la Página
- [ ] **5.1.1** Crear ruta dinámica /eventos/[slug]/page.tsx
- [ ] **5.1.2** Implementar generateStaticParams (ISR)
- [ ] **5.1.3** Implementar generateMetadata dinámico
- [ ] **5.1.4** Crear Server Component para fetch de evento
- [ ] **5.1.5** Manejar evento no encontrado (404)

### 5.2 Contenido del Evento
- [ ] **5.2.1** Crear componente EventDetail
- [ ] **5.2.2** Mostrar imagen principal (hero)
- [ ] **5.2.3** Mostrar título y fechas
- [ ] **5.2.4** Mostrar descripción completa
- [ ] **5.2.5** Mostrar información del organizador
- [ ] **5.2.6** Mostrar ubicación con dirección
- [ ] **5.2.7** Crear galería de imágenes (si hay)

### 5.3 Mapa de Ubicación
- [ ] **5.3.1** Instalar react-map-gl o Google Maps
- [ ] **5.3.2** Crear componente EventMap
- [ ] **5.3.3** Mostrar pin en coordenadas del evento
- [ ] **5.3.4** Enlace a Google Maps para navegación

### 5.4 SEO Avanzado
- [ ] **5.4.1** Implementar JSON-LD (Event schema)
- [ ] **5.4.2** Crear Open Graph Image dinámico
- [ ] **5.4.3** Crear Twitter Card Image dinámico
- [ ] **5.4.4** Implementar canonical URL
- [ ] **5.4.5** Añadir breadcrumbs estructurados
- [ ] **5.4.6** Implementar meta tags para redes sociales

### 5.5 Acciones del Usuario
- [ ] **5.5.1** Botón "Añadir a Google Calendar"
- [ ] **5.5.2** Botones de compartir (WhatsApp, Facebook, Twitter)
- [ ] **5.5.3** Botón "Copiar enlace"
- [ ] **5.5.4** Botón "Volver al calendario"

---

## FASE 6: SISTEMA UGC (USER GENERATED CONTENT)

### 6.1 Formulario de Envío
- [ ] **6.1.1** Crear página /submit-evento
- [ ] **6.1.2** Crear componente EventSubmissionForm
- [ ] **6.1.3** Implementar validación con Zod
- [ ] **6.1.4** Campo: Título del evento
- [ ] **6.1.5** Campo: Descripción
- [ ] **6.1.6** Campo: Fecha inicio y fin
- [ ] **6.1.7** Campo: Ubicación (con autocompletado)
- [ ] **6.1.8** Campo: Información del organizador
- [ ] **6.1.9** Campo: Imagen promocional (upload)
- [ ] **6.1.10** Campo: Tipo de evento (select)
- [ ] **6.1.11** Campo: Tipos de moto permitidas
- [ ] **6.1.12** Implementar drag & drop para imágenes

### 6.2 Upload de Imágenes
- [ ] **6.2.1** Configurar Supabase Storage
- [ ] **6.2.2** Crear función de upload con compresión
- [ ] **6.2.3** Validar tipo y tamaño de archivo
- [ ] **6.2.4** Generar thumbnails (opcional)
- [ ] **6.2.5** Guardar URL en formulario

### 6.3 Proceso de Envío
- [ ] **6.3.1** Crear API route POST /api/eventos
- [ ] **6.3.2** Validar datos en servidor
- [ ] **6.3.3** Generar slug único automáticamente
- [ ] **6.3.4** Guardar evento con status: pending
- [ ] **6.3.5** Asociar submitted_by si está autenticado
- [ ] **6.3.6** Mostrar mensaje de éxito al usuario
- [ ] **6.3.7** Enviar email de confirmación (opcional)

---

## FASE 7: PANEL DE ADMINISTRACIÓN

### 7.1 Protección de Rutas
- [ ] **7.1.1** Crear middleware para proteger /admin/*
- [ ] **7.1.2** Verificar rol de admin/moderator
- [ ] **7.1.3** Redirigir a login si no está autenticado

### 7.2 Dashboard Admin
- [ ] **7.2.1** Crear página /admin
- [ ] **7.2.2** Mostrar estadísticas (eventos pendientes, totales, etc.)
- [ ] **7.2.3** Crear navegación del panel admin

### 7.3 Moderación de Eventos
- [ ] **7.3.1** Crear página /admin/moderacion
- [ ] **7.3.2** Listar eventos con status: pending
- [ ] **7.3.3** Crear componente EventModerationCard
- [ ] **7.3.4** Mostrar preview del evento
- [ ] **7.3.5** Implementar botón "Aprobar"
- [ ] **7.3.6** Implementar botón "Rechazar" con motivo
- [ ] **7.3.7** API route PATCH /api/eventos/[id]/status
- [ ] **7.3.8** Actualizar moderated_by y moderated_at
- [ ] **7.3.9** Enviar notificación al usuario (email opcional)

### 7.4 Gestión de Eventos Aprobados
- [ ] **7.4.1** Listar todos los eventos aprobados
- [ ] **7.4.2** Implementar búsqueda y filtros
- [ ] **7.4.3** Botón editar evento
- [ ] **7.4.4** Botón eliminar evento (soft delete)
- [ ] **7.4.5** Botón destacar evento

---

## FASE 8: SEO Y OPTIMIZACIÓN

### 8.1 Metadata y Meta Tags
- [x] **8.1.1** Configurar metadata global en layout.tsx
- [ ] **8.1.2** Implementar metadata dinámica en eventos
- [~] **8.1.3** Añadir favicon y apple-touch-icon (referenciado)
- [x] **8.1.4** Configurar theme-color

### 8.2 Open Graph y Social
- [~] **8.2.1** Crear OG Image dinámico con @vercel/og (instalado)
- [ ] **8.2.2** Implementar opengraph-image.tsx
- [ ] **8.2.3** Implementar twitter-image.tsx
- [ ] **8.2.4** Probar con Facebook Sharing Debugger
- [ ] **8.2.5** Probar con Twitter Card Validator

### 8.3 Structured Data
- [ ] **8.3.1** Crear componente JsonLd
- [ ] **8.3.2** Implementar Event schema
- [ ] **8.3.3** Implementar Organization schema
- [ ] **8.3.4** Implementar BreadcrumbList schema
- [ ] **8.3.5** Validar con Google Rich Results Test

### 8.4 Sitemap y Robots
- [~] **8.4.1** Crear robots.txt (next-sitemap)
- [x] **8.4.2** Configurar next-sitemap
- [~] **8.4.3** Generar sitemap.xml dinámico
- [ ] **8.4.4** Incluir todas las URLs de eventos
- [ ] **8.4.5** Submit a Google Search Console

### 8.5 Performance
- [~] **8.5.1** Optimizar imágenes con next/image
- [~] **8.5.2** Implementar lazy loading
- [ ] **8.5.3** Configurar ISR para páginas de evento
- [ ] **8.5.4** Auditar con Lighthouse (objetivo >90)
- [ ] **8.5.5** Optimizar Core Web Vitals

---

## FASE 9: TESTING Y QA

### 9.1 Testing Manual
- [ ] **9.1.1** Testear flujo completo de usuario
- [ ] **9.1.2** Testear formulario de envío de evento
- [ ] **9.1.3** Testear panel de moderación
- [ ] **9.1.4** Testear responsive en móvil
- [ ] **9.1.5** Testear en diferentes navegadores

### 9.2 Testing SEO
- [ ] **9.2.1** Verificar meta tags en eventos
- [ ] **9.2.2** Verificar OG images
- [ ] **9.2.3** Verificar JSON-LD
- [ ] **9.2.4** Verificar URLs amigables
- [ ] **9.2.5** Verificar sitemap

### 9.3 Optimizaciones Finales
- [ ] **9.3.1** Revisar console.logs y debugging
- [ ] **9.3.2** Optimizar bundle size
- [ ] **9.3.3** Revisar accesibilidad (a11y)
- [ ] **9.3.4** Añadir error boundaries
- [ ] **9.3.5** Manejar estados de error 404/500

---

## FASE 10: DESPLIEGUE

### 10.1 Preparación
- [ ] **10.1.1** Crear cuenta en Vercel
- [ ] **10.1.2** Conectar repositorio GitHub
- [ ] **10.1.3** Configurar variables de entorno en Vercel
- [ ] **10.1.4** Configurar dominio personalizado (opcional)

### 10.2 Deploy
- [ ] **10.2.1** Hacer push a main
- [ ] **10.2.2** Verificar build exitoso
- [ ] **10.2.3** Verificar funcionalidad en producción
- [ ] **10.2.4** Configurar analytics (Vercel Analytics)

### 10.3 Post-Deploy
- [ ] **10.3.1** Configurar Google Search Console
- [ ] **10.3.2** Configurar Google Analytics 4
- [ ] **10.3.3** Crear primer evento de prueba
- [ ] **10.3.4** Compartir en redes para testeo

---

## 📊 RESUMEN DE PROGRESO

| Fase | Total | Completado | % |
|------|-------|------------|---|
| Fase 1: Setup | 15 | 10 | 67% |
| Fase 2: Diseño UI | 16 | 10 | 63% |
| Fase 3: Autenticación | 11 | 0 | 0% |
| Fase 4: Calendario | 17 | 12 | 71% |
| Fase 5: Detalle Evento | 18 | 0 | 0% |
| Fase 6: UGC | 14 | 3 | 21% |
| Fase 7: Admin | 14 | 0 | 0% |
| Fase 8: SEO | 18 | 0 | 0% |
| Fase 9: Testing | 13 | 0 | 0% |
| Fase 10: Deploy | 9 | 0 | 0% |
| **TOTAL** | **145** | **45** | **31%** |

---

**Última actualización:** 2024-01-30  
**Versión:** 1.0
