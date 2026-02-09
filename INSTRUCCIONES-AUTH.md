# 🔐 Instrucciones: Sistema de Autenticación

## ✅ Fase 1 y 2 Completadas

**Estado:** Backend + UI básica implementados

---

## 📋 PASO 1: Ejecutar Migración en Supabase

### Opción A: Desde Dashboard de Supabase (Recomendado)

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Click en "SQL Editor" en el menú lateral
3. Click en "New Query"
4. Copia y pega todo el contenido de:
   ```
   /home/xemnas/.openclaw/projects/active/motoevent/my-app/scripts/auth-migration.sql
   ```
5. Click en "Run" (ejecutar)
6. Verifica que no hay errores

### Opción B: Desde CLI

```bash
cd /home/xemnas/.openclaw/projects/active/motoevent/my-app
supabase db push
```

---

## 🔧 PASO 2: Configurar Variables de Entorno

Verifica que tu `.env.local` tiene estas variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu-url-aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui

# App
NEXT_PUBLIC_APP_URL=http://100.115.187.76:3000
```

---

## 👤 PASO 3: Crear Tu Cuenta de Admin

### 3.1 Registrarse

1. Reinicia el servidor:
   ```bash
   pkill -f "next dev"
   cd /home/xemnas/.openclaw/projects/active/motoevent/my-app
   npm run dev -- --hostname 0.0.0.0 --port 3000
   ```

2. Abre http://100.115.187.76:3000
3. Click en el botón de usuario (arriba en el sidebar)
4. Tab "Registrarse"
5. Ingresa tu email + contraseña
6. Revisa tu email y verifica la cuenta (click en el link)

### 3.2 Promover a Admin

1. Ve al SQL Editor en Supabase Dashboard
2. Ejecuta este query (reemplaza con tu email):

```sql
UPDATE profiles 
SET 
  role = 'admin', 
  can_submit_events = true, 
  can_moderate_events = true 
WHERE email = 'tu-email@ejemplo.com';
```

3. Cierra sesión y vuelve a iniciar sesión
4. Ahora deberías ver "Panel de Admin" en el menú de usuario

---

## 🧪 PASO 4: Probar el Sistema

### A) Probar Autenticación

- ✅ Registrar nueva cuenta
- ✅ Verificar email
- ✅ Iniciar sesión
- ✅ Ver perfil
- ✅ Cerrar sesión

### B) Probar Roles

**Como Viewer:**
- Solo puede ver eventos públicos
- No ve panel de moderación
- No puede enviar eventos

**Como Admin:**
- Ve todo
- Puede acceder a /admin/users (próximo paso)
- Puede acceder a /moderar

---

## 📊 LO QUE SE HA IMPLEMENTADO

### ✅ Base de Datos
- Tabla `profiles` extendida con roles y permisos
- Enum `user_role` (viewer, contributor, moderator, admin)
- Row Level Security (RLS) configurado
- Triggers para auto-crear profiles
- Índices para performance

### ✅ Backend
- AuthContext con hooks
- Funciones de signIn/signUp/signOut
- Verificación de roles y permisos
- Integración con Supabase Auth

### ✅ Frontend
- UserButton en sidebar
- AuthModal (login/signup)
- Dropdown de usuario con perfil y logout
- Integración con ThemeProvider

---

## 🚀 PRÓXIMOS PASOS

### Fase 3: Middleware y Protección de Rutas
- Proteger `/moderar` (solo moderators/admins)
- Proteger `/submit-evento` (solo contributors+)
- Proteger `/admin/*` (solo admins)
- Redirect automático si no autorizado

### Fase 4: Admin Dashboard
- Página `/admin/users`
- Tabla de usuarios con roles
- Gestión de permisos
- Estadísticas básicas

### Fase 5: Vincular Eventos con Usuarios
- `submitted_by` al enviar eventos
- `moderated_by` al aprobar/rechazar
- Mostrar autor en eventos
- Filtrar "mis eventos" en profile

---

## 🐛 Troubleshooting

### "Error al iniciar sesión"
- Verifica que ejecutaste la migración SQL
- Verifica variables de entorno
- Verifica que Supabase Auth está habilitado

### "No se crea el perfil automáticamente"
- Verifica que el trigger `on_auth_user_created` existe
- Ejecuta de nuevo la parte del trigger en la migración

### "RLS bloquea todo"
- Temporalmente desactiva RLS para debug:
  ```sql
  ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
  ALTER TABLE events DISABLE ROW LEVEL SECURITY;
  ```
- Cuando funcione, vuélvelo a activar

---

## 📝 Notas

- El sistema usa JWT tokens (manejados por Supabase)
- Las sesiones persisten en localStorage
- Email de verificación es necesario (configurable en Supabase)
- Passwords mínimo 6 caracteres (configurable)

---

## 🎯 Estado Actual

```
✅ Fase 1: Setup Básico (completado)
✅ Fase 2: UI de Autenticación (completado)
⏳ Fase 3: Middleware (siguiente)
⏳ Fase 4: Admin Dashboard (siguiente)
⏳ Fase 5: Vincular Eventos (siguiente)
```

---

**¿Todo listo?** Ejecuta la migración y prueba el login/signup antes de continuar con la Fase 3.
