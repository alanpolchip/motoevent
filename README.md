# 🏍️ MotoEvents Calendar

El calendario de eventos moteros de referencia. Una PWA construida con Next.js 14, TypeScript, Tailwind CSS y Supabase.

## 🚀 Stack Tecnológico

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Backend/DB:** [Supabase](https://supabase.com/)
- **Calendario:** [FullCalendar](https://fullcalendar.io/)
- **PWA:** [next-pwa](https://github.com/shadowwalker/next-pwa)

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta en [Supabase](https://supabase.com/)

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/motoevents-calendar.git
   cd motoevents-calendar
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.local.example .env.local
   # Editar .env.local con tus credenciales de Supabase
   ```

4. **Configurar base de datos**
   - Crear proyecto en Supabase
   - Ejecutar las migraciones en `scripts/migrations.sql`
   - Configurar Storage bucket para imágenes

5. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

6. **Abrir en navegador**
   ```
   http://localhost:3000
   ```

## 📁 Estructura del Proyecto

```
my-app/
├── app/                    # Next.js App Router
│   ├── (landing)/          # Grupo de rutas
│   ├── eventos/[slug]/     # Páginas de eventos (SEO)
│   ├── api/                # API Routes
│   ├── admin/              # Panel de administración
│   └── submit-evento/      # Formulario UGC
├── components/             # Componentes React
│   ├── ui/                 # Componentes base (shadcn)
│   ├── calendar/           # Componentes del calendario
│   ├── event/              # Componentes de eventos
│   └── seo/                # Componentes SEO
├── lib/                    # Utilidades y configuración
│   ├── supabase/           # Clientes Supabase
│   └── utils/              # Helpers
├── types/                  # TypeScript definitions
├── public/                 # Assets estáticos
└── scripts/                # Scripts y migraciones
```

## 🗄️ Base de Datos

### Tablas Principales

- **profiles**: Extensión de auth.users con roles
- **events**: Eventos moteros con toda la información
- **event_favorites**: Favoritos de usuarios
- **event_views**: Analytics de visualizaciones

### Estados de Eventos

- `pending`: Pendiente de moderación
- `approved`: Aprobado y visible
- `rejected`: Rechazado
- `cancelled`: Cancelado

## 🔐 Autenticación y Roles

- **user**: Puede ver eventos y enviar propuestas
- **moderator**: Puede aprobar/rechazar eventos
- **admin**: Control total del sistema

## 🚀 Despliegue

### Vercel (Recomendado)

```bash
npm i -g vercel
vercel
```

### Variables de Entorno en Producción

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_MAPBOX_TOKEN=
```

## 📱 PWA

La aplicación incluye:
- Manifest.json configurado
- Service Worker con next-pwa
- Iconos para todas las plataformas
- Soporte offline básico

## 🔍 SEO

- Server-Side Rendering (SSR)
- Metadata dinámica por página
- Open Graph images dinámicas
- JSON-LD structured data
- Sitemap.xml automático
- URLs amigables con slugs

## 📝 Scripts Útiles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Linting
npm run lint

# Generar sitemap
npm run postbuild
```

## 🤝 Contribuir

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

---

Desarrollado con ❤️ para la comunidad motera.
