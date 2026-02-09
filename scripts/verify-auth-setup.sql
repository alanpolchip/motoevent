-- ============================================
-- SCRIPT DE VERIFICACIÓN: Sistema de Auth
-- ============================================
-- Ejecuta esto en Supabase SQL Editor para verificar
-- qué se instaló correctamente

-- 1. Verificar tabla profiles
SELECT 
  'profiles table exists' as check_name,
  EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') as result;

-- 2. Verificar columnas de profiles
SELECT 
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 3. Verificar tipo enum user_role
SELECT 
  'user_role enum exists' as check_name,
  EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') as result;

-- 4. Si existe, mostrar valores del enum
SELECT 
  enumlabel as role_value
FROM pg_enum 
JOIN pg_type ON pg_enum.enumtypid = pg_type.oid
WHERE pg_type.typname = 'user_role'
ORDER BY enumsortorder;

-- 5. Verificar función handle_new_user
SELECT 
  'handle_new_user function exists' as check_name,
  EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'handle_new_user'
  ) as result;

-- 6. Verificar trigger on_auth_user_created
SELECT 
  'on_auth_user_created trigger exists' as check_name,
  EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) as result;

-- 7. Verificar RLS habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('profiles', 'events');

-- 8. Verificar políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('profiles', 'events')
ORDER BY tablename, policyname;

-- 9. Contar usuarios existentes
SELECT 
  'Total profiles' as metric,
  COUNT(*) as count
FROM profiles;

-- 10. Ver profiles existentes (si hay)
SELECT 
  id,
  email,
  full_name,
  role,
  can_submit_events,
  can_moderate_events,
  created_at
FROM profiles
ORDER BY created_at DESC;
