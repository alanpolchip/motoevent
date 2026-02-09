# 🔄 Cómo Reiniciar el Servidor de Desarrollo

## Método Rápido (Recomendado)

```bash
# 1. Detener el servidor actual
pkill -f "next dev"

# 2. Iniciar el servidor
cd /home/xemnas/.openclaw/projects/active/motoevent/my-app
npm run dev -- --hostname 0.0.0.0 --port 3000
```

---

## Método Paso a Paso

### 1️⃣ Detener el servidor actual

```bash
# Encuentra el proceso en el puerto 3000
lsof -ti:3000

# Si devuelve un número (PID), mátalo:
kill -9 $(lsof -ti:3000)

# O simplemente:
pkill -f "next dev"
```

### 2️⃣ Navegar al proyecto

```bash
cd /home/xemnas/.openclaw/projects/active/motoevent/my-app
```

### 3️⃣ Iniciar el servidor

```bash
npm run dev -- --hostname 0.0.0.0 --port 3000
```

Verás algo como:

```
▲ Next.js 14.1.0
  - Local:        http://localhost:3000
  - Network:      http://0.0.0.0:3000
  - Environments: .env.local

✓ Ready in 2.5s
```

### 4️⃣ Verificar acceso

Abre en el navegador:
```
http://100.115.187.76:3000
```

---

## 🆘 Solución de Problemas

### El servidor no inicia

```bash
# Limpia puerto 3000
pkill -f "next dev"
fuser -k 3000/tcp

# Limpia cache de Next.js
cd /home/xemnas/.openclaw/projects/active/motoevent/my-app
rm -rf .next
npm run dev -- --hostname 0.0.0.0 --port 3000
```

### Error de módulos/dependencias

```bash
cd /home/xemnas/.openclaw/projects/active/motoevent/my-app
rm -rf node_modules package-lock.json
npm install
npm run dev -- --hostname 0.0.0.0 --port 3000
```

### Error de compilación TypeScript

```bash
# Construye de nuevo
npm run build

# Si falla, reinicia sin build
npm run dev -- --hostname 0.0.0.0 --port 3000
```

---

## 🔍 Verificar Estado

```bash
# Ver si el servidor está corriendo
lsof -ti:3000

# Ver logs del servidor
# (Si está corriendo en segundo plano, no verás logs)
# Para ver logs, ejecuta sin --background
```

---

## 📌 Ubicación del Proyecto

```
Proyecto: /home/xemnas/.openclaw/projects/active/motoevent/my-app
Acceso web: http://100.115.187.76:3000
Red: Tailscale
```

---

## 🎯 Comando de 1 Línea

```bash
pkill -f "next dev" && cd /home/xemnas/.openclaw/projects/active/motoevent/my-app && npm run dev -- --hostname 0.0.0.0 --port 3000
```

Copia y pega este comando en la terminal cuando necesites reiniciar.
