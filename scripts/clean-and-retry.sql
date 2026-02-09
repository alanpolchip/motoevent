-- ============================================
-- LIMPIAR TODO Y EMPEZAR DE NUEVO
-- ============================================
-- CUIDADO: Esto borra todos los usuarios y profiles
-- Solo usa esto si estás en desarrollo

-- 1. Borrar todos los profiles
DELETE FROM profiles;

-- 2. Borrar todos los usuarios de auth
-- (Comentado por seguridad - descomenta si quieres borrar TODO)
-- DELETE FROM auth.users;

-- 3. Recrear la función del trigger con mejor manejo de errores
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- Intentar insertar el profile
  INSERT INTO public.profiles (id, email, full_name, role, can_submit_events, can_moderate_events)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
    'viewer',
    false,
    false
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log el error pero NO FALLAR
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Recrear el trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Para cualquier usuario existente que no tenga profile, créalo
INSERT INTO profiles (id, email, full_name, role, can_submit_events, can_moderate_events)
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data->>'full_name',
  'viewer',
  false,
  false
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 6. Desactivar RLS para debug
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;

-- 7. Verificación final
SELECT 
  '✅ Limpieza y recreación completada' as status,
  (SELECT COUNT(*) FROM auth.users) as total_auth_users,
  (SELECT COUNT(*) FROM profiles) as total_profiles,
  CASE 
    WHEN (SELECT COUNT(*) FROM auth.users) = (SELECT COUNT(*) FROM profiles) 
    THEN '✅ Todos los usuarios tienen profile'
    ELSE '⚠️  Hay usuarios sin profile'
  END as sincronizacion;
