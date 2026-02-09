# 🔧 Solución: "Database error saving new user"

## 🎯 SOLUCIÓN RÁPIDA (Hazlo en orden)

### 1️⃣ Ejecutar Migración Simplificada

Esta versión **desactiva RLS** temporalmente para que funcione mientras debugueamos.

**En Supabase Dashboard:**

1. Ve a: https://app.supabase.com/project/rxsageunbazmorjvphhc/sql
2. Click en **"New Query"**
3. Copia **TODO** el archivo:
   ```
   my-app/scripts/auth-migration-minimal.sql
   ```
4. **Pega** en el editor
5. Click en **"Run"** (botón verde)
6. Debe aparecer: `Migración minimal completada. RLS DESACTIVADO para debug.`

---

### 2️⃣ Reiniciar el Servidor

```bash
pkill -f "next dev"
cd /home/xemnas/.openclaw/projects/active/motoevent/my-app
npm run dev -- --hostname 0.0.0.0 --port 3000
```

---

### 3️⃣ Probar Registro de Nuevo

1. Ve a: http://100.115.187.76:3000
2. Click en botón de usuario (arriba en sidebar)
3. Tab "Registrarse"
4. Intenta crear cuenta

**¿Funciona?** ✅ Continúa al paso 4  
**¿Aún falla?** ❌ Ve a la sección "Diagnóstico Avanzado" abajo

---

### 4️⃣ Promover Tu Cuenta a Admin

**En Supabase Dashboard → SQL Editor:**

```sql
-- Reemplaza con tu email
UPDATE profiles 
SET 
  role = 'admin', 
  can_submit_events = true, 
  can_moderate_events = true 
WHERE email = 'tu@email.com';
```

Ejecuta esto y verifica:

```sql
-- Verificar tu cuenta
SELECT email, role, can_submit_events, can_moderate_events 
FROM profiles 
WHERE email = 'tu@email.com';
```

---

### 5️⃣ Reactivar RLS (Cuando Todo Funcione)

**Importante:** RLS está desactivado para debug. Cuando todo funcione:

```sql
-- Reactivar Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Luego ejecuta el archivo completo:
-- scripts/auth-migration.sql (políticas RLS)
```

---

## 🔍 DIAGNÓSTICO AVANZADO

### Test de Conexión Automático

```bash
cd /home/xemnas/.openclaw/projects/active/motoevent/my-app
node scripts/test-supabase-connection.js
```

Este script te dirá **exactamente** qué falta.

---

### Verificar Estado en Supabase

**SQL Editor → New Query:**

```sql
-- Ver qué existe
SELECT 
  'profiles table' as item,
  EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') as exists
UNION ALL
SELECT 
  'user_role enum',
  EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role')
UNION ALL
SELECT 
  'handle_new_user function',
  EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user')
UNION ALL
SELECT 
  'on_auth_user_created trigger',
  EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created');
```

**Todos deben ser `true`.**

---

### Ver Logs en Tiempo Real

**Supabase Dashboard:**

1. Ve a: https://app.supabase.com/project/rxsageunbazmorjvphhc/logs/explorer
2. Filtra por "postgres" o "auth"
3. Intenta registrarte
4. Ve qué error aparece

---

### Ver Perfiles Existentes

```sql
SELECT 
  id, 
  email, 
  full_name, 
  role, 
  created_at 
FROM profiles
ORDER BY created_at DESC;
```

---

## 🐛 ERRORES COMUNES

### "Database error saving new user"
**Causa:** El trigger `handle_new_user` no existe o falló  
**Solución:** Ejecuta `auth-migration-minimal.sql`

### "email already exists"
**Causa:** Ya te registraste antes  
**Solución:** 
```sql
DELETE FROM auth.users WHERE email = 'tu@email.com';
```

### "User not found" después de registro
**Causa:** Supabase requiere verificación de email  
**Solución:** 
- Revisa tu email (spam también)
- O desactiva email verification en Supabase:
  - Settings → Auth → Email Auth → Desactivar "Enable email confirmations"

---

## 📞 SI NADA FUNCIONA

1. **Ejecuta el test automático:**
   ```bash
   node scripts/test-supabase-connection.js
   ```

2. **Muéstrame la salida completa**

3. **Y también ejecuta en Supabase SQL Editor:**
   ```sql
   -- Ver usuarios en auth
   SELECT id, email, created_at 
   FROM auth.users 
   ORDER BY created_at DESC;

   -- Ver profiles
   SELECT id, email, role, created_at 
   FROM profiles 
   ORDER BY created_at DESC;
   ```

---

## ✅ CHECKLIST

- [ ] Ejecuté `auth-migration-minimal.sql` en Supabase
- [ ] Vi el mensaje "Migración minimal completada"
- [ ] Reinicié el servidor Next.js
- [ ] Probé registrarme de nuevo
- [ ] Funcionó ✅ o aún falla ❌
- [ ] Si funcionó, promoví mi cuenta a admin
- [ ] Verifiqué que veo "Panel de Admin" en el menú

---

## 🎯 OBJETIVO

Al final deberías poder:
- ✅ Registrarte con email + contraseña
- ✅ Iniciar sesión
- ✅ Ver tu nombre/email en el dropdown
- ✅ Ver "Panel de Admin" (si promoviste tu cuenta)
