# 🔍 Diagnóstico Rápido - Error "Database error saving new user"

## ✅ YA TIENES LA BASE DE DATOS CONFIGURADA

El error "type user_role already exists" significa que **ya ejecutaste la migración antes**.

El problema es que el **trigger no está funcionando correctamente** o tiene un error.

---

## 🚀 SOLUCIÓN EN 3 PASOS

### **Paso 1: Verificar el Estado Actual**

En **Supabase SQL Editor**:

1. Ve a: https://app.supabase.com/project/rxsageunbazmorjvphhc/sql
2. New Query
3. Copia y pega TODO de: `scripts/check-status.sql`
4. Run

**Esto te mostrará:**
- ✅ Qué columnas tiene la tabla profiles
- ✅ Si existe el trigger
- ✅ Si RLS está activado o desactivado
- ✅ Cuántos usuarios hay

**Importante:** Fíjate si hay usuarios en `auth.users` que NO tienen profile.

---

### **Paso 2: Arreglar el Trigger**

En **Supabase SQL Editor** (New Query):

Copia y pega TODO de: `scripts/fix-trigger-only.sql`

Ejecuta y debe decir: `✅ Trigger recreado correctamente`

**Esto:**
- ✅ Recrea la función `handle_new_user` con mejor manejo de errores
- ✅ Recrea el trigger
- ✅ Desactiva RLS temporalmente
- ✅ NO borra nada (es seguro)

---

### **Paso 3: Probar el Registro**

1. Ve a: http://100.115.187.76:3000
2. Click en botón de usuario (sidebar)
3. Tab "Registrarse"
4. Intenta crear una cuenta

**¿Funciona?** ✅ → Continúa al Paso 4  
**¿Aún falla?** ❌ → Ve a "Plan B" abajo

---

### **Paso 4: Promover a Admin**

En **Supabase SQL Editor**:

```sql
-- Reemplaza con tu email
UPDATE profiles 
SET 
  role = 'admin', 
  can_submit_events = true, 
  can_moderate_events = true 
WHERE email = 'tu@email.com';

-- Verificar
SELECT email, role, can_submit_events, can_moderate_events 
FROM profiles 
WHERE email = 'tu@email.com';
```

---

## 🔧 PLAN B: Si Aún Falla

### Opción 1: Limpiar y Recrear

**⚠️ CUIDADO:** Esto borra usuarios existentes.

En **Supabase SQL Editor**:

```sql
-- Ver cuántos usuarios tienes
SELECT COUNT(*) FROM auth.users;
SELECT COUNT(*) FROM profiles;
```

Si son de prueba (0-2 usuarios), ejecuta: `scripts/clean-and-retry.sql`

### Opción 2: Crear Profile Manualmente

Si ya te registraste pero no se creó el profile:

```sql
-- Ver tu usuario en auth
SELECT id, email FROM auth.users WHERE email = 'tu@email.com';

-- Crear el profile manualmente (copia el ID de arriba)
INSERT INTO profiles (id, email, full_name, role, can_submit_events, can_moderate_events)
VALUES (
  'tu-user-id-aqui',
  'tu@email.com',
  'Tu Nombre',
  'admin',
  true,
  true
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  can_submit_events = true,
  can_moderate_events = true;
```

### Opción 3: Desactivar Verificación de Email

En **Supabase Dashboard**:

1. Ve a: Authentication → Providers → Email
2. Desactiva: "Confirm email"
3. Guarda
4. Intenta registrarte de nuevo

---

## 🧪 Test Automático

```bash
cd /home/xemnas/.openclaw/projects/active/motoevent/my-app
node scripts/test-supabase-connection.js
```

Esto te dirá exactamente qué falla.

---

## 📊 Ver Logs de Supabase

Si quieres ver el error exacto:

1. Ve a: https://app.supabase.com/project/rxsageunbazmorjvphhc/logs/explorer
2. Filtra: `postgres-logs`
3. Busca: `Error creating profile` o `handle_new_user`

---

## 🎯 CHECKLIST

- [ ] Ejecuté `check-status.sql` para ver el estado
- [ ] Ejecuté `fix-trigger-only.sql` para arreglar el trigger
- [ ] Vi el mensaje "Trigger recreado correctamente"
- [ ] Intenté registrarme de nuevo
- [ ] **Funcionó** ✅ o **Aún falla** ❌

---

## 💡 CAUSA PROBABLE

El error "Database error saving new user" típicamente significa una de estas cosas:

1. **Trigger no existe** → `fix-trigger-only.sql` lo arregla
2. **Trigger falla silenciosamente** → Logs en Supabase te dirán por qué
3. **RLS bloqueando la inserción** → Ya lo desactivamos
4. **Columna faltante en profiles** → `fix-trigger-only.sql` las añade

---

## 🆘 SI NADA FUNCIONA

Ejecuta estos 3 queries y pásame los resultados:

```sql
-- 1. Estado del trigger
SELECT tgname, tgenabled 
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- 2. Usuarios vs Profiles
SELECT 
  (SELECT COUNT(*) FROM auth.users) as auth_users,
  (SELECT COUNT(*) FROM profiles) as profiles;

-- 3. Último usuario creado
SELECT u.id, u.email, u.created_at, p.id as profile_id
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC
LIMIT 1;
```

Y también el output de:

```bash
node scripts/test-supabase-connection.js
```
