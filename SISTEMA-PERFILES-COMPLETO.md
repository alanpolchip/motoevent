# ✅ Sistema de Perfiles y Permisos Implementado

## 🎯 LO QUE SE HA IMPLEMENTADO

### 1. **Página de Perfil (`/profile`)** ✅

Ubicación: http://100.115.187.76:3000/profile

**Funcionalidades:**
- ✅ Ver información del usuario (nombre, email, rol)
- ✅ Editar nombre completo
- ✅ Cambiar avatar (URL de imagen)
- ✅ Ver permisos actuales de la cuenta
- ✅ Solicitar permisos de colaborador
- ✅ Solicitar permisos de moderador
- ✅ Ver solicitudes pendientes
- ✅ Ver fecha de registro y último acceso

### 2. **Visibilidad Condicional de Botones** ✅

**En el Sidebar:**
- **Botón "Publicar"** → Solo visible si `canSubmitEvents = true`
- **Botón "Moderar"** → Solo visible si `canModerateEvents = true`
- **Menú "Panel de Admin"** → Solo visible si `role = admin`

**Esto significa:**
- Viewers: Solo ven calendario y filtros
- Contributors: Ven "Publicar"
- Moderators: Ven "Publicar" + "Moderar"
- Admins: Ven todo + "Panel de Admin"

### 3. **Sistema de Solicitudes de Permisos** ✅

**Base de datos:**
- Tabla `permission_requests` creada
- Tipos: `contributor` o `moderator`
- Estados: `pending`, `approved`, `rejected`
- Incluye razón del usuario y respuesta del admin

**APIs:**
- `GET /api/permission-requests` → Listar solicitudes
- `POST /api/permission-requests` → Crear solicitud
- `PATCH /api/permission-requests/[id]` → Aprobar/rechazar

---

## 📋 PASOS PARA ACTIVARLO

### **Paso 1: Ejecutar Migración SQL**

En **Supabase SQL Editor**:

Copia y ejecuta: `scripts/create-permission-requests.sql`

Esto crea la tabla `permission_requests`.

### **Paso 2: Reiniciar Servidor**

```bash
pkill -f "next dev"
cd /home/xemnas/.openclaw/projects/active/motoevent/my-app
npm run dev -- --hostname 0.0.0.0 --port 3000
```

### **Paso 3: Probar el Sistema**

1. **Registra dos usuarios:**
   - Usuario A (Admin)
   - Usuario B (Viewer)

2. **Promover Usuario A a Admin:**
   ```sql
   UPDATE profiles 
   SET role = 'admin', can_submit_events = true, can_moderate_events = true 
   WHERE email = 'admin@email.com';
   ```

3. **Como Usuario B (Viewer):**
   - Inicia sesión
   - Ve que NO aparece el botón "Publicar" ni "Moderar"
   - Ve a `/profile`
   - Click en "Solicitar Permisos de Colaborador"
   - Rellena el motivo
   - Enviar

4. **Como Usuario A (Admin):**
   - Inicia sesión
   - Ve que SÍ aparece "Publicar", "Moderar" y "Panel de Admin"
   - Ve a `/admin/users` (próximo paso, aún no creado)

---

## 🎨 CAPTURAS DE PANTALLA DE REFERENCIA

### Página de Perfil

```
┌─────────────────────────────────────────┐
│ Mi Perfil                  [Editar]     │
├─────────────────────────────────────────┤
│  [Avatar]    │  Nombre: Alan            │
│     A        │  Email: alan@email.com   │
│              │  Tipo: 🛡️ Administrador  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Permisos de la Cuenta                   │
├─────────────────────────────────────────┤
│ ✅ Ver eventos públicos                 │
│ ✅ Enviar eventos para moderación       │
│ ✅ Aprobar/rechazar eventos             │
│ ✅ Gestionar usuarios y roles           │
└─────────────────────────────────────────┘
```

### Sidebar según Rol

**Viewer:**
```
👤 Usuario
───────────
🏠 Logo
📅 1W 2W 4W
🔍 Filtros
```

**Contributor:**
```
👤 Usuario
───────────
🏠 Logo
📅 1W 2W 4W
🔍 Filtros
───────────
🔶 Publicar  ← Nuevo
```

**Moderator:**
```
👤 Usuario
───────────
🏠 Logo
📅 1W 2W 4W
🔍 Filtros
───────────
📝 Moderar  ← Nuevo
🔶 Publicar
```

**Admin:**
```
👤 Usuario
───────────
🏠 Logo
📅 1W 2W 4W
🔍 Filtros
───────────
📝 Moderar
🔶 Publicar
⚙️  Admin    ← En dropdown
```

---

## 🔄 FLUJO DE SOLICITUD DE PERMISOS

```
Usuario Viewer
     │
     ├─> Ve a /profile
     │
     ├─> Click "Solicitar Permisos de Colaborador"
     │
     ├─> Rellena motivo: "Organizo eventos en Madrid"
     │
     └─> [Solicitud creada con status=pending]
            │
            ├─> Admin recibe notificación (próximo paso)
            │
            ├─> Admin revisa en /admin/users
            │
            ├─> Admin aprueba
            │
            └─> [Perfil actualizado: role=contributor, can_submit_events=true]
                   │
                   └─> Usuario B recibe notificación (próximo paso)
                          │
                          └─> Ahora ve el botón "Publicar" ✅
```

---

## 🚀 PRÓXIMOS PASOS (Fase 4)

### Dashboard de Admin (`/admin/users`)

**Funcionalidades pendientes:**
- [ ] Tabla de usuarios con roles
- [ ] Gestión de roles (cambiar rol de un usuario)
- [ ] Ver solicitudes pendientes
- [ ] Aprobar/rechazar solicitudes
- [ ] Suspender usuarios
- [ ] Ver estadísticas

---

## 📊 ESTRUCTURA DE BASE DE DATOS

```sql
-- Tabla: profiles
- id (UUID)
- email
- full_name
- avatar_url
- role (viewer|contributor|moderator|admin)
- can_submit_events (boolean)
- can_moderate_events (boolean)
- created_at
- updated_at
- last_login_at

-- Tabla: permission_requests
- id (UUID)
- user_id → profiles(id)
- request_type (contributor|moderator)
- status (pending|approved|rejected)
- reason (texto del usuario)
- organization (opcional)
- reviewed_by → profiles(id)
- reviewed_at
- rejection_reason
- created_at
- updated_at
```

---

## 🧪 TESTING

### Test 1: Visibilidad de Botones

1. Crea usuario con role=viewer
2. Inicia sesión
3. Verifica que NO ves "Publicar" ni "Moderar"
4. Promover a contributor en DB
5. Recarga página
6. Verifica que SÍ ves "Publicar"

### Test 2: Solicitar Permisos

1. Como viewer, ve a /profile
2. Click "Solicitar Permisos"
3. Rellena motivo
4. Enviar
5. Verifica que aparece en "Solicitudes Pendientes"
6. Verifica que no puedes solicitar de nuevo (ya tienes pendiente)

### Test 3: Editar Perfil

1. Ve a /profile
2. Click "Editar"
3. Cambia nombre
4. Añade URL de avatar
5. Guardar
6. Verifica que se guardó correctamente

---

## 🐛 TROUBLESHOOTING

### "No veo el botón Publicar"
→ Verifica tu rol en DB: `SELECT role, can_submit_events FROM profiles WHERE email = 'tu@email.com'`

### "Error al solicitar permisos"
→ Verifica que ejecutaste `create-permission-requests.sql`

### "No puedo editar mi perfil"
→ Verifica que RLS está desactivado: `SELECT rowsecurity FROM pg_tables WHERE tablename = 'profiles'`

---

## ✅ CHECKLIST

- [ ] Ejecuté `create-permission-requests.sql` en Supabase
- [ ] Reinicié el servidor
- [ ] Probé iniciar sesión como viewer
- [ ] Verifiqué que NO veo botones de moderador/admin
- [ ] Probé solicitar permisos desde /profile
- [ ] Verifiqué que puedo editar mi nombre y avatar
- [ ] Promoví un usuario a admin
- [ ] Verifiqué que SÍ veo "Panel de Admin"

---

**Estado:** ✅ Sistema de perfiles completo implementado.  
**Próximo paso:** Dashboard de Admin (Fase 4)
