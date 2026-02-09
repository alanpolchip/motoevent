-- ============================================
-- MIGRACIÓN: Sistema de Autenticación y Roles
-- ============================================

-- 1. Crear tipo ENUM para roles
CREATE TYPE user_role AS ENUM ('viewer', 'contributor', 'moderator', 'admin');

-- 2. Extender tabla profiles (si no existe, crearla)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  
  -- Roles y permisos
  role user_role NOT NULL DEFAULT 'viewer',
  can_submit_events BOOLEAN DEFAULT false,
  can_moderate_events BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Si la tabla ya existe, añadir columnas nuevas
DO $$ 
BEGIN
  -- Añadir columna role si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='role') THEN
    ALTER TABLE profiles ADD COLUMN role user_role NOT NULL DEFAULT 'viewer';
  END IF;
  
  -- Añadir columna can_submit_events si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='can_submit_events') THEN
    ALTER TABLE profiles ADD COLUMN can_submit_events BOOLEAN DEFAULT false;
  END IF;
  
  -- Añadir columna can_moderate_events si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='can_moderate_events') THEN
    ALTER TABLE profiles ADD COLUMN can_moderate_events BOOLEAN DEFAULT false;
  END IF;
  
  -- Añadir columna last_login_at si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='profiles' AND column_name='last_login_at') THEN
    ALTER TABLE profiles ADD COLUMN last_login_at TIMESTAMPTZ;
  END IF;
END $$;

-- 3. Actualizar permisos booleanos según el rol
UPDATE profiles SET 
  can_submit_events = (role IN ('contributor', 'moderator', 'admin')),
  can_moderate_events = (role IN ('moderator', 'admin'))
WHERE role IS NOT NULL;

-- 4. Función para auto-crear profile al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, can_submit_events, can_moderate_events)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'viewer',
    false,
    false
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Trigger para crear profile automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Trigger para updated_at en profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- 8. Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 9. Políticas para PROFILES

-- Todos pueden leer su propio perfil
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

-- Admins pueden leer todos los perfiles
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
CREATE POLICY "Admins can read all profiles" 
  ON profiles FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Usuarios pueden actualizar su propio perfil (excepto role)
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND 
    (role = (SELECT role FROM profiles WHERE id = auth.uid()))
  );

-- Solo admins pueden actualizar roles
DROP POLICY IF EXISTS "Admins can update roles" ON profiles;
CREATE POLICY "Admins can update roles" 
  ON profiles FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 10. Políticas para EVENTS

-- Eventos aprobados son públicos (sin auth)
DROP POLICY IF EXISTS "Approved events are public" ON events;
CREATE POLICY "Approved events are public" 
  ON events FOR SELECT 
  USING (status = 'approved');

-- Usuarios autenticados pueden ver eventos aprobados
DROP POLICY IF EXISTS "Authenticated users can see approved events" ON events;
CREATE POLICY "Authenticated users can see approved events" 
  ON events FOR SELECT 
  USING (auth.uid() IS NOT NULL AND status = 'approved');

-- Contributors pueden ver sus propios eventos
DROP POLICY IF EXISTS "Contributors can see own events" ON events;
CREATE POLICY "Contributors can see own events" 
  ON events FOR SELECT 
  USING (
    auth.uid() IS NOT NULL AND 
    submitted_by = auth.uid()
  );

-- Moderadores y admins pueden ver todos los eventos
DROP POLICY IF EXISTS "Moderators can see all events" ON events;
CREATE POLICY "Moderators can see all events" 
  ON events FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('moderator', 'admin')
    )
  );

-- Contributors pueden insertar eventos
DROP POLICY IF EXISTS "Contributors can insert events" ON events;
CREATE POLICY "Contributors can insert events" 
  ON events FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND can_submit_events = true
    ) AND
    submitted_by = auth.uid()
  );

-- Moderadores y admins pueden actualizar eventos
DROP POLICY IF EXISTS "Moderators can update events" ON events;
CREATE POLICY "Moderators can update events" 
  ON events FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND can_moderate_events = true
    )
  );

-- 11. Crear índices para performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_events_submitted_by ON events(submitted_by);
CREATE INDEX IF NOT EXISTS idx_events_moderated_by ON events(moderated_by);

-- ============================================
-- CREAR USUARIO ADMIN INICIAL (Opcional)
-- ============================================
-- Descomenta y ejecuta esto manualmente después de crear tu cuenta:
--
-- UPDATE profiles 
-- SET role = 'admin', 
--     can_submit_events = true, 
--     can_moderate_events = true 
-- WHERE email = 'tu-email@ejemplo.com';

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar que todo se creó correctamente
SELECT 
  'Profiles table exists' as check_name,
  EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') as result
UNION ALL
SELECT 
  'Role enum exists',
  EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role')
UNION ALL
SELECT 
  'RLS enabled on profiles',
  EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'profiles' AND rowsecurity = true)
UNION ALL
SELECT 
  'RLS enabled on events',
  EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'events' AND rowsecurity = true);
