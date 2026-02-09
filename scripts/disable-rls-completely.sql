-- ============================================
-- DESACTIVAR RLS COMPLETAMENTE
-- ============================================
-- Esto elimina TODAS las políticas y desactiva RLS
-- Para desarrollo, es más fácil trabajar sin RLS

-- 1. Desactivar RLS en ambas tablas
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;

-- 2. Eliminar TODAS las políticas existentes
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update roles" ON profiles;
DROP POLICY IF EXISTS "Approved events are public" ON events;
DROP POLICY IF EXISTS "Authenticated users can see approved events" ON events;
DROP POLICY IF EXISTS "Contributors can see own events" ON events;
DROP POLICY IF EXISTS "Moderators can see all events" ON events;
DROP POLICY IF EXISTS "Contributors can insert events" ON events;
DROP POLICY IF EXISTS "Moderators can update events" ON events;

-- 3. Verificación
SELECT 
  schemaname,
  tablename,
  CASE WHEN rowsecurity THEN '🔒 ACTIVADO (MAL)' ELSE '🔓 DESACTIVADO (BIEN)' END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' AND tablename IN ('profiles', 'events');

-- 4. Ver si quedan políticas
SELECT 
  tablename,
  policyname
FROM pg_policies
WHERE tablename IN ('profiles', 'events');

SELECT '✅ RLS desactivado completamente. Sin políticas.' as status;
