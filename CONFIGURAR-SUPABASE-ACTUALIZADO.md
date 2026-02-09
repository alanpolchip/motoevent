# 🔧 Configurar Supabase (Instrucciones Actualizadas 2026)

## ✅ PASOS BASADOS EN DOCUMENTACIÓN OFICIAL

Basado en: https://supabase.com/docs/guides/auth

---

## 1️⃣ DESACTIVAR RLS (Eliminar Recursión)

**Ya sabes hacer esto:**

En **Supabase SQL Editor** → https://app.supabase.com/project/rxsageunbazmorjvphhc/sql

- New Query
- Copia: `scripts/disable-rls-completely.sql`
- Run

✅ Debe decir: `RLS desactivado completamente`

---

## 2️⃣ CONFIGURAR SITE URL Y REDIRECT URLS

### Ubicación Correcta en Dashboard:

Ve a: **Authentication → URL Configuration**

Ruta directa: https://app.supabase.com/project/rxsageunbazmorjvphhc/auth/url-configuration

### Cambios a hacer:

#### A) Site URL
Busca el campo **"Site URL"**

Cambiar de:
```
http://localhost:3000
```

A:
```
http://100.115.187.76:3000
```

#### B) Redirect URLs
Busca la sección **"Redirect URLs"**

Añadir (uno por línea):
```
http://100.115.187.76:3000/**
http://localhost:3000/**
```

El `**` es un wildcard que permite cualquier ruta.

**Save** → Guardar cambios

---

## 3️⃣ DESACTIVAR VERIFICACIÓN DE EMAIL

### Ubicación Correcta en Dashboard:

Ve a: **Authentication → Providers**

Ruta directa: https://app.supabase.com/project/rxsageunbazmorjvphhc/auth/providers

### Cambios a hacer:

1. Busca **"Email"** en la lista de providers
2. Click en **"Email"** para expandir
3. Busca la opción: **"Confirm email"**
4. **Desactívala** (toggle OFF)
5. **Save** → Guardar cambios

**¿Por qué?**
- Para desarrollo es más rápido
- No necesitas verificar emails cada vez
- Puedes registrarte e iniciar sesión inmediatamente

**Nota:** La documentación oficial dice:

> "You can configure whether users need to verify their email to sign in. On hosted Supabase projects, this is true by default."

Fuente: https://supabase.com/docs/guides/auth/passwords

---

## 4️⃣ REINICIAR SERVIDOR NEXT.JS

```bash
pkill -f "next dev"
cd /home/xemnas/.openclaw/projects/active/motoevent/my-app
npm run dev -- --hostname 0.0.0.0 --port 3000
```

---

## 5️⃣ PROBAR REGISTRO

1. Ve a: http://100.115.187.76:3000
2. Click en botón de usuario (arriba en sidebar)
3. Tab "Registrarse"
4. Email + contraseña → Crear cuenta

**Ahora debería funcionar inmediatamente** sin pedir verificación.

---

## 6️⃣ PROMOVER A ADMIN

Una vez registrado, en **Supabase SQL Editor**:

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

Cierra sesión y vuelve a entrar. Deberías ver **"Panel de Admin"** en el menú.

---

## 📸 CAPTURAS DE PANTALLA DE REFERENCIA

### URL Configuration (paso 2)

```
Authentication > URL Configuration
├── Site URL: http://100.115.187.76:3000
└── Redirect URLs:
    ├── http://100.115.187.76:3000/**
    └── http://localhost:3000/**
```

### Providers (paso 3)

```
Authentication > Providers
└── Email
    └── ☐ Confirm email (DESACTIVAR ESTO)
```

---

## 🐛 SI NO ENCUENTRAS ALGO

### "No veo Authentication en el menú"

Busca el icono de una llave 🔑 o un usuario 👤 en el menú lateral izquierdo.

### "No veo Providers"

Dentro de Authentication, busca un tab o sección llamada "Providers" o "Email Providers".

### "No veo URL Configuration"

Dentro de Authentication, busca "URL Configuration" o "URLs" o "Redirect URLs".

---

## 📖 REFERENCIAS OFICIALES

- Auth Email: https://supabase.com/docs/guides/auth/passwords
- Redirect URLs: https://supabase.com/docs/guides/auth/redirect-urls
- Dashboard Auth: https://supabase.com/dashboard/project/_/auth/providers

---

## ✅ CHECKLIST FINAL

- [ ] Ejecuté `disable-rls-completely.sql` ✅
- [ ] Cambié Site URL en **Authentication → URL Configuration**
- [ ] Añadí Redirect URLs en **Authentication → URL Configuration**
- [ ] Desactivé "Confirm email" en **Authentication → Providers → Email**
- [ ] Reinicié el servidor Next.js
- [ ] Probé registrarme
- [ ] **Funcionó** sin pedir verificación de email
- [ ] Promoví mi cuenta a admin
- [ ] Veo "Panel de Admin" en el menú

---

## 🆘 SI AÚN NO LO ENCUENTRAS

Toma una captura de pantalla de tu dashboard de Supabase y la vemos juntos.

O dime exactamente qué ves en el menú lateral izquierdo de Supabase Dashboard.
