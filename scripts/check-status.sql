-- ============================================
-- VERIFICACIÓN RÁPIDA: ¿Qué tengo?
-- ============================================

-- 1. Estado de la tabla profiles
SELECT 
  'profiles' as tabla,
  column_name as columna,
  data_type as tipo,
  is_nullable as nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. ¿Existe el enum?
SELECT 'user_role enum exists' as check_item, 
       CASE WHEN EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') 
            THEN '✅ SÍ' 
            ELSE '❌ NO' 
       END as status;

-- 3. ¿Existe la función?
SELECT 'handle_new_user function' as check_item,
       CASE WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user') 
            THEN '✅ SÍ' 
            ELSE '❌ NO' 
       END as status;

-- 4. ¿Existe el trigger?
SELECT 'on_auth_user_created trigger' as check_item,
       CASE WHEN EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') 
            THEN '✅ SÍ' 
            ELSE '❌ NO' 
       END as status;

-- 5. ¿RLS activado?
SELECT 
  tablename as tabla,
  CASE WHEN rowsecurity THEN '🔒 ACTIVADO' ELSE '🔓 DESACTIVADO' END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' AND tablename IN ('profiles', 'events');

-- 6. ¿Cuántos usuarios hay?
SELECT 'Usuarios en auth.users' as tabla, COUNT(*) as total FROM auth.users
UNION ALL
SELECT 'Perfiles en profiles', COUNT(*) FROM profiles;

-- 7. Ver usuarios recientes
SELECT 
  u.email,
  u.created_at as registrado_en_auth,
  p.created_at as profile_creado,
  p.role,
  CASE 
    WHEN p.id IS NULL THEN '❌ SIN PROFILE'
    ELSE '✅ TIENE PROFILE'
  END as estado
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC
LIMIT 5;
