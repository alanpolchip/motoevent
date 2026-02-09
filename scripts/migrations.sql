-- ============================================
-- MIGRACIONES SQL - MotoEvents Calendar
-- Ejecutar en SQL Editor de Supabase
-- ============================================

-- ============================================
-- 1. TABLA PROFILES (Extensión de auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para crear perfil automáticamente al registrar usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. TABLA EVENTS (Eventos principales)
-- ============================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT NOT NULL,
  
  -- Fechas
  start_date DATE NOT NULL,
  end_date DATE,
  start_time TIME,
  end_time TIME,
  
  -- Ubicación
  location_name TEXT NOT NULL,
  location_address TEXT,
  location_city TEXT NOT NULL,
  location_country TEXT DEFAULT 'España',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Organizador
  organizer_name TEXT NOT NULL,
  organizer_email TEXT,
  organizer_phone TEXT,
  organizer_website TEXT,
  organizer_instagram TEXT,
  organizer_facebook TEXT,
  
  -- Imágenes
  featured_image TEXT NOT NULL,
  gallery_images TEXT[],
  
  -- Categorización
  event_type TEXT DEFAULT 'otro' CHECK (event_type IN (
    'concentracion', 'ruta', 'competicion', 'feria', 
    'taller', 'quedada', 'benefico', 'otro'
  )),
  motorcycle_types TEXT[] DEFAULT ARRAY['todas'],
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  
  -- Estado y Moderación
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'needs_edit')),
  submitted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  moderated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  moderated_at TIMESTAMPTZ,
  rejection_reason TEXT,
  
  -- Métricas
  view_count INTEGER DEFAULT 0,
  added_to_calendar_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

-- ============================================
-- 3. ÍNDICES PARA PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_dates ON events(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_location ON events(location_city, location_country);
CREATE INDEX IF NOT EXISTS idx_events_tags ON events USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_events_submitted_by ON events(submitted_by);

-- ============================================
-- 4. TABLA EVENT_FAVORITES (Favoritos)
-- ============================================
CREATE TABLE IF NOT EXISTS event_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON event_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_event ON event_favorites(event_id);

-- ============================================
-- 5. TABLA EVENT_VIEWS (Analytics)
-- ============================================
CREATE TABLE IF NOT EXISTS event_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_hash TEXT,
  user_agent TEXT,
  referrer TEXT
);

CREATE INDEX IF NOT EXISTS idx_views_event ON event_views(event_id);
CREATE INDEX IF NOT EXISTS idx_views_date ON event_views(viewed_at);

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_views ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Profiles are viewable by everyone" 
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- EVENTS POLICIES
CREATE POLICY "Approved events are viewable by everyone" 
  ON events FOR SELECT USING (status = 'approved');

-- Permitir inserción anónima para el formulario UGC (usando service role key en API)
CREATE POLICY "Allow anonymous insert via service role" 
  ON events FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins and moderators can view all events" 
  ON events FOR SELECT TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "Admins and moderators can update events" 
  ON events FOR UPDATE TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "Admins can delete events" 
  ON events FOR DELETE TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- EVENT_FAVORITES POLICIES
CREATE POLICY "Users can view own favorites" 
  ON event_favorites FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add own favorites" 
  ON event_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own favorites" 
  ON event_favorites FOR DELETE USING (auth.uid() = user_id);

-- EVENT_VIEWS POLICIES (solo insert, no lectura directa)
CREATE POLICY "Anyone can insert views" 
  ON event_views FOR INSERT WITH CHECK (true);

-- ============================================
-- 7. FUNCIONES AUXILIARES
-- ============================================

-- Función para incrementar contador de views
CREATE OR REPLACE FUNCTION increment_event_views(event_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE events 
  SET view_count = view_count + 1 
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para incrementar contador de "added to calendar"
CREATE OR REPLACE FUNCTION increment_calendar_count(event_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE events 
  SET added_to_calendar_count = added_to_calendar_count + 1 
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 8. STORAGE BUCKET PARA IMÁGENES
-- ============================================

-- Crear bucket para imágenes de eventos (ejecutar en Storage de Supabase)
-- NOTA: Esto debe hacerse desde la UI de Supabase o con la API de administración

-- Políticas de storage (ejecutar después de crear el bucket):
-- INSERT POLICY: Allow authenticated users to upload images
-- SELECT POLICY: Allow public access to view images
-- DELETE POLICY: Allow admins to delete images

-- ============================================
-- 9. DATOS DE PRUEBA (Opcional)
-- ============================================

-- Insertar eventos de ejemplo (descomentar para usar)
/*
INSERT INTO events (
  slug, title, description, short_description, start_date, end_date,
  location_name, location_city, location_country,
  organizer_name, featured_image, event_type, status
) VALUES 
(
  'concentracion-pinguinos-2024',
  'Concentración Pingüinos 2024',
  'La concentración motera más importante de España...',
  'La concentración motera más importante de España. Más de 30.000 motos en Valladolid.',
  '2024-07-12', '2024-07-14',
  'Recinto Ferial de Valladolid', 'Valladolid', 'España',
  'Pingüinos Org',
  'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200',
  'concentracion',
  'approved'
),
(
  'ruta-guardianes-2024',
  'Ruta de los Guardianes 2024',
  'Ruta motera benéfica por las carreteras más emblemáticas...',
  'Ruta benéfica por carreteras emblemáticas. Recaudación para hospitales.',
  '2024-05-15', NULL,
  'Salida: Plaza Mayor Madrid', 'Madrid', 'España',
  'Guardianes Moto Club',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200',
  'ruta',
  'approved'
);
*/

-- ============================================
-- 10. CREAR PRIMER ADMIN (Ejecutar después de crear el primer usuario)
-- ============================================

-- Para crear el primer admin, ejecutar:
-- UPDATE profiles SET role = 'admin' WHERE email = 'tu-email@ejemplo.com';
