# 🔧 Arreglar Errores de RLS y Email

## 🚨 PROBLEMAS DETECTADOS

1. ❌ **Recursión infinita en RLS**: Las políticas se llaman a sí mismas
2. ❌ **Email apunta a localhost**: En vez de tu IP de Tailscale

---

## ✅ SOLUCIÓN COMPLETA (5 minutos)

### **Paso 1: Desactivar RLS Completamente**

**En Supabase SQL Editor** → https://app.supabase.com/project/rxsageunbazmorjvphhc/sql

**New Query** → Copia **TODO** de:
```
scripts/disable-rls-completely.sql
```

**Run** → Debe decir: `✅ RLS desactivado completamente. Sin políticas.`

**¿Por qué?**
- RLS está causando recursión infinita
- Para desarrollo, es más fácil sin RLS
- Lo reactivaremos cuando todo funcione

---

### **Paso 2: Configurar URL en Supabase**

**En Supabase Dashboard:**

1. Ve a: https://app.supabase.com/project/rxsageunbazmorjvphhc/settings/auth
2. Busca **"Site URL"**
3. Cámbialo de `http://localhost:3000` a:
   ```
   http://100.115.187.76:3000
   ```
4. Busca **"Redirect URLs"** (más abajo)
5. Añade:
   ```
   http://100.115.187.76:3000/**
   ```
6. **Save** (guardar)

---

### **Paso 3: Desactivar Verificación de Email (Opcional pero Recomendado)**

Para desarrollo, es más fácil sin verificación de email.

**En Supabase Dashboard:**

1. Ve a: https://app.supabase.com/project/rxsageunbazmorjvphhc/auth/providers
2. Click en **"Email"**
3. **Desactiva**: "Confirm email"
4. **Desactiva**: "Secure email change"
5. **Save**

**¿Por qué?**
- Más rápido para testing
- No necesitas verificar emails
- Puedes registrarte y entrar inmediatamente

---

### **Paso 4: Reiniciar Servidor**

```bash
pkill -f "next dev"
cd /home/xemnas/.openclaw/projects/active/motoevent/my-app
npm run dev -- --hostname 0.0.0.0 --port 3000
```

---

### **Paso 5: Probar Registro**

1. Ve a: http://100.115.187.76:3000
2. Click en botón de usuario
3. Registrarse
4. **Ahora debería funcionar sin pedir verificación**

---

## 🎯 RESULTADO ESPERADO

Después de estos pasos:

- ✅ **Sin errores de RLS** (desactivado)
- ✅ **Registro funciona inmediatamente** (sin verificar email)
- ✅ **Puedes iniciar sesión** directamente
- ✅ **URLs correctas** (apuntan a tu IP de Tailscale)

---

## 🔄 ALTERNATIVA: Si Quieres Mantener Verificación de Email

Si prefieres mantener la verificación de email (NO recomendado para desarrollo):

### En Supabase Dashboard → Auth → Email Templates:

1. Click en **"Confirm signup"**
2. Cambia `{{ .ConfirmationURL }}` por:
   ```
   http://100.115.187.76:3000/auth/confirm?token_hash={{ .TokenHash }}&type=signup
   ```
3. Save

Pero es más fácil desactivar la verificación completamente.

---

## 🧪 VERIFICAR QUE FUNCIONÓ

```bash
cd /home/xemnas/.openclaw/projects/active/motoevent/my-app
node scripts/test-supabase-connection.js
```

Debe decir:
- ✅ Tabla profiles accesible
- ✅ Tabla events accesible
- ✅ Supabase Auth funcionando
- ✅ Registro de usuarios funcionando

---

## 🐛 SI AÚN HAY ERRORES

### Error: "infinite recursion detected"
→ Ejecuta de nuevo `disable-rls-completely.sql`

### Error: "Email link is invalid"
→ Desactiva "Confirm email" en Supabase Auth

### Error: "Database error saving new user"
→ Ejecuta `fix-trigger-only.sql`

---

## 📊 VERIFICAR CONFIGURACIÓN ACTUAL

**En Supabase SQL Editor:**

```sql
-- Ver RLS status (debe estar desactivado)
SELECT 
  tablename,
  CASE WHEN rowsecurity THEN '🔒 ACTIVADO' ELSE '🔓 DESACTIVADO' END as rls
FROM pg_tables 
WHERE tablename IN ('profiles', 'events');

-- Ver usuarios y profiles
SELECT 
  u.email,
  p.role,
  p.can_submit_events,
  p.can_moderate_events
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC;
```

---

## ✅ CHECKLIST COMPLETO

- [ ] Ejecuté `disable-rls-completely.sql` en Supabase
- [ ] Vi "RLS desactivado completamente"
- [ ] Cambié Site URL en Supabase a `http://100.115.187.76:3000`
- [ ] Añadí `http://100.115.187.76:3000/**` a Redirect URLs
- [ ] Desactivé "Confirm email" en Supabase Auth
- [ ] Reinicié el servidor Next.js
- [ ] Probé registrarme de nuevo
- [ ] **FUNCIONÓ** ✅

---

## 🎓 CONTEXTO TÉCNICO

### ¿Por qué RLS causaba recursión?

Las políticas RLS estaban escritas para verificar roles consultando la tabla `profiles`, pero al consultar `profiles` se activaban las políticas RLS de nuevo, causando un loop infinito.

**Solución temporal:** Desactivar RLS completamente para desarrollo.

**Solución final:** Reescribir las políticas sin recursión (lo haremos después).

### ¿Por qué localhost en los emails?

Supabase usa el "Site URL" configurado en el dashboard para generar los links de verificación. Si estaba en `localhost`, los emails apuntaban ahí.

**Solución:** Cambiar Site URL a tu IP de Tailscale.

---

## 📞 SIGUIENTE PASO

Una vez que el registro funcione:

```sql
-- Promover tu cuenta a admin
UPDATE profiles 
SET 
  role = 'admin', 
  can_submit_events = true, 
  can_moderate_events = true 
WHERE email = 'tu@email.com';
```

Y luego continuamos con las **Fases 3-5**:
- Fase 3: Middleware (proteger rutas)
- Fase 4: Admin Dashboard
- Fase 5: Vincular eventos con usuarios
