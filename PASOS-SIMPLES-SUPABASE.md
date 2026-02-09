# 🎯 Pasos Simples - Configurar Supabase

## TU PROYECTO
**ID:** rxsageunbazmorjvphhc  
**URL Base:** https://app.supabase.com/project/rxsageunbazmorjvphhc

---

## PASO 1: Desactivar RLS ✅

Ya sabes hacer esto (SQL Editor).

---

## PASO 2: Configurar URLs

### Ir a:
```
https://app.supabase.com/project/rxsageunbazmorjvphhc/auth/url-configuration
```

### O navegar manualmente:
1. Abre tu proyecto en Supabase Dashboard
2. Menú lateral → Busca el icono 🔑 o texto "Authentication"
3. Dentro de Authentication → Click en "URL Configuration"

### Cambiar:

**Site URL:**
```
De: http://localhost:3000
A:  http://100.115.187.76:3000
```

**Redirect URLs** (añadir):
```
http://100.115.187.76:3000/**
```

**Save** (guardar)

---

## PASO 3: Desactivar Verificación de Email

### Ir a:
```
https://app.supabase.com/project/rxsageunbazmorjvphhc/auth/providers
```

### O navegar manualmente:
1. Abre tu proyecto en Supabase Dashboard
2. Menú lateral → "Authentication"
3. Dentro de Authentication → Click en "Providers"
4. Busca "Email" en la lista
5. Click en "Email" para expandir

### Buscar y desactivar:
```
☐ Confirm email    ← Desactivar esto (toggle OFF)
```

**Save** (guardar)

---

## PASO 4: Probar

```bash
# Reiniciar servidor
pkill -f "next dev"
cd /home/xemnas/.openclaw/projects/active/motoevent/my-app
npm run dev -- --hostname 0.0.0.0 --port 3000
```

Ir a: http://100.115.187.76:3000 y registrarse.

---

## PASO 5: Promover a Admin

```sql
UPDATE profiles 
SET role = 'admin', can_submit_events = true, can_moderate_events = true 
WHERE email = 'tu@email.com';
```

---

## 🆘 SI NO ENCUENTRAS ALGO

**Opción 1:** Usa los links directos de arriba

**Opción 2:** Búscame en el dashboard:
- **Authentication** (menú lateral izquierdo)
  - **URL Configuration** (tab o sección)
  - **Providers** (tab o sección)

**Opción 3:** Mándame captura de pantalla de:
- Tu menú lateral izquierdo en Supabase Dashboard
- Lo que ves cuando clickeas "Authentication"
