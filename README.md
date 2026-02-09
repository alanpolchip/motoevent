# 🏍️ MotoEvents Calendar

Calendario de eventos moteros construido con Next.js 14, TypeScript, Tailwind CSS y Supabase.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

## 🚀 Features

- ✅ **Multi-View Calendar** - 3 vistas: Semana / 2 Semanas / Mes
- ✅ **Event Cards** - Tarjetas visuales con imágenes full-background
- ✅ **Multi-Day Events** - Eventos que abarcan múltiples días
- ✅ **Responsive Sidebar** - Navegación lateral minimalista (60px)
- ✅ **Supabase Backend** - Autenticación + Base de datos
- ✅ **PWA Ready** - Progressive Web App habilitada

## 📸 Screenshots

_(Pendiente - agregar capturas de pantalla)_

## 🛠️ Stack Tecnológico

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Backend**: [Supabase](https://supabase.com/)
- **State**: React hooks (useState, useMemo)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📋 Requisitos

- Node.js 18+
- npm o yarn
- Cuenta en Supabase

## 🔧 Instalación

```bash
# Clonar repositorio
git clone https://github.com/alanpolchip/motoevent.git
cd motoevent

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Iniciar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 🗄️ Base de Datos

### Configurar Supabase

1. Crear proyecto en [Supabase](https://supabase.com)
2. Ejecutar migraciones: `scripts/migrations.sql`
3. Configurar Storage bucket para imágenes
4. Copiar credenciales a `.env.local`

### Tablas principales

- `events` - Eventos moteros
- `profiles` - Usuarios + roles
- `event_favorites` - Favoritos de usuarios

## 📁 Estructura del Proyecto

```
my-app/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Página principal (calendario)
│   ├── moderar/           # Panel de moderación
│   └── api/eventos/       # API Routes
├── components/
│   ├── sidebar/           # Barra lateral
│   └── calendar/          # Vistas del calendario
│       ├── BiweeklyView.tsx   # Vista 2 semanas
│       ├── WeekView.tsx       # Vista 1 semana
│       └── MonthView.tsx      # Vista mes
├── lib/
│   ├── supabase/          # Clientes Supabase
│   └── utils/             # Utilidades
└── types/                 # TypeScript definitions
```

## 🎨 Vistas del Calendario

### Vista Semana (1W)
- 7 columnas (Lun-Dom)
- Celdas gigantes de altura completa
- Ideal para ver detalles de eventos

### Vista 2 Semanas (2W) - Por defecto
- 2 filas x 7 columnas
- Balance entre detalle y vista general

### Vista Mes (4W)
- 5 filas x 7 columnas
- Vista aérea del mes completo

## 🚀 Scripts

```bash
npm run dev      # Desarrollo
npm run build    # Build producción
npm run start    # Servidor producción
npm run lint     # Linting
```

## 🔐 Variables de Entorno

```env
NEXT_PUBLIC_SUPABASE_URL=tu-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📝 Changelog

### v1.0.0 (2026-02-09)
- ✅ Sidebar lateral con selector de vistas
- ✅ Multi-view calendar (1W/2W/4W)
- ✅ Event cards con imágenes full-background
- ✅ Eventos multi-día con repetición visual
- ✅ Rectángulo naranja para día actual
- ✅ Múltiples eventos dividen espacio equitativamente

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'feat: agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE)

---

Desarrollado con ❤️ por Alan + Snowy 🏍️
