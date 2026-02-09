# 🐌 Diagnóstico: Perfil Carga Lento o Redirige

## 🐛 PROBLEMA

**Síntomas:**
- `/profile` tarda mucho en cargar
- O te redirige al home automáticamente
- El resto de la web funciona rápido

---

## ✅ SOLUCIONES APLICADAS

### 1. **Evitar Redirect Prematuro**

**Antes:** Redirigía inmediatamente si `user` era null (incluso mientras cargaba)

**Ahora:** Espera a que termine de cargar (`loading = false`) antes de redirigir

### 2. **No Cargar Solicitudes Automáticamente**

**Antes:** Intentaba cargar `permission_requests` al abrir la página

**Ahora:** Solo carga información básica (nombre, avatar, rol)

### 3. **Página de Test Creada**

Nueva ruta: `/profile-test` para diagnosticar problemas de auth

---

## 🧪 DIAGNÓSTICO PASO A PASO

### **Test 1: Página de Diagnóstico**

1. Ve a: http://100.115.187.76:3000/profile-test

**Deberías ver:**
```
Loading: ✅ No
User: ✅ Sí
  { id: "...", email: "tu@email.com" }
Profile: ✅ Sí
  { email: "...", role: "admin", ... }
```

**Si ves:**
- `Loading: ⏳ Sí` → AuthContext está cargando (espera 2-3 segundos)
- `User: ❌ No` → No estás autenticado (inicia sesión primero)
- `Profile: ❌ No` → Hay problema con la tabla profiles

---

### **Test 2: Perfil Normal**

1. Ve a: http://100.115.187.76:3000/profile

**Debe:**
- ✅ Cargar en 1-2 segundos
- ✅ Mostrar tu nombre, email, rol
- ✅ Permitir editar nombre y avatar
- ✅ NO redirigir al home

**Si redirige al home:**
→ No estás autenticado. Ve a `/profile-test` primero.

---

## 🔍 VERIFICAR ESTADO DE AUTENTICACIÓN

### En DevTools del Navegador:

1. Abre las DevTools (F12)
2. Ve a la pestaña **Console**
3. Escribe:
   ```javascript
   document.cookie
   ```
4. Busca una cookie con "supabase" en el nombre

**Si no hay cookies de Supabase:**
→ No estás autenticado. Inicia sesión primero.

### En el Código:

1. Abre `/profile-test` con DevTools abierto
2. En la Console, deberías ver:
   - No errores rojos
   - Posiblemente: "Error loading profile..." (normal si la tabla no existe)

---

## 🚀 SOLUCIONES SEGÚN EL PROBLEMA

### Problema A: "Me redirige al home"

**Causa:** No estás autenticado

**Solución:**
1. Ve a http://100.115.187.76:3000
2. Click en el botón de usuario (arriba en sidebar)
3. Inicia sesión
4. Ahora intenta ir a `/profile`

---

### Problema B: "Tarda mucho en cargar"

**Posibles causas:**
1. La query a `profiles` es lenta
2. Supabase tiene latencia
3. Hay un error silencioso

**Diagnóstico:**
1. Abre DevTools → Network
2. Ve a `/profile`
3. Mira las requests:
   - ¿Hay alguna request a Supabase que tarda mucho?
   - ¿Hay errores 4xx o 5xx?

**Solución temporal:**
```sql
-- En Supabase SQL Editor, verificar que existe el profile
SELECT * FROM profiles WHERE email = 'tu@email.com';
```

---

### Problema C: "Carga infinita (spinner eterno)"

**Causa:** AuthContext.loading nunca se pone en false

**Solución:**
1. Ve a `/profile-test`
2. Si dice `Loading: ⏳ Sí` después de 5 segundos:
   - Hay problema con Supabase Auth
   - Verifica `.env.local`:
     ```
     NEXT_PUBLIC_SUPABASE_URL=...
     NEXT_PUBLIC_SUPABASE_ANON_KEY=...
     ```

---

## 🛠️ SOLUCIÓN RÁPIDA (SI NADA FUNCIONA)

### Usar ProfileSimple (Sin Solicitudes)

Edita `app/profile/page.tsx`:

```typescript
// Al inicio del archivo, importar:
import { ProfileSimple } from './ProfileSimple';

// Y reemplazar todo el export default por:
export default ProfileSimple;
```

Esto usa una versión super simplificada sin solicitudes de permisos.

---

## 📊 COMPARACIÓN DE TIEMPOS

### Tiempos Esperados:

| Acción | Tiempo Esperado |
|--------|-----------------|
| Carga inicial de AuthContext | 0.5-1s |
| Carga de `/profile` (autenticado) | 1-2s |
| Carga de `/profile` (no autenticado) | 0.5s (redirect) |
| Carga de `/profile-test` | 0.5s |

### Si tarda más de 5 segundos:
→ Hay un problema. Sigue el diagnóstico de arriba.

---

## 🧪 COMANDO DE DIAGNÓSTICO COMPLETO

En DevTools Console:

```javascript
// Verificar estado completo
console.log({
  cookies: document.cookie.includes('supabase'),
  location: window.location.href,
  localStorage: Object.keys(localStorage).filter(k => k.includes('supabase'))
});
```

Copia el output y pásame el resultado.

---

## ✅ CHECKLIST

- [ ] Servidor corriendo en puerto 3000 ✅
- [ ] Estoy autenticado (veo mi avatar en sidebar) ✅
- [ ] Probé `/profile-test` → Veo User: ✅ Sí
- [ ] Probé `/profile` → Carga en 1-2 segundos
- [ ] Puedo editar mi nombre y guardar
- [ ] NO me redirige al home

---

## 🆘 SI AÚN NO FUNCIONA

Ejecuta esto y pásame el resultado:

```bash
cd /home/xemnas/.openclaw/projects/active/motoevent/my-app
grep -r "NEXT_PUBLIC_SUPABASE" .env.local
```

Y también:
1. Abre `/profile-test` con DevTools
2. Copia TODO lo que sale en Console
3. Pásame el output

---

## 📖 ARCHIVOS MODIFICADOS

- `app/profile/page.tsx` → No redirige prematuramente
- `app/profile/page.tsx` → No carga solicitudes automáticamente
- `app/profile-test/page.tsx` → Nueva página de diagnóstico

---

## 🎯 RESUMEN

**Problema:** Perfil lento o redirige  
**Causa:** Redirect prematuro + carga de solicitudes  
**Solución:** Esperar a loading + no cargar solicitudes  
**Estado:** ✅ Servidor corriendo con cambios

**Próximo paso:** Ve a `/profile-test` y confirma que ves tus datos.
