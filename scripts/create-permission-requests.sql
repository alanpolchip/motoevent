-- ============================================
-- TABLA: Solicitudes de Permisos
-- ============================================

-- 1. Crear tipo enum para tipo de solicitud
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'permission_request_type') THEN
    CREATE TYPE permission_request_type AS ENUM ('contributor', 'moderator');
  END IF;
END $$;

-- 2. Crear tipo enum para estado de solicitud
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'request_status') THEN
    CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected');
  END IF;
END $$;

-- 3. Crear tabla de solicitudes
CREATE TABLE IF NOT EXISTS permission_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  request_type permission_request_type NOT NULL,
  status request_status NOT NULL DEFAULT 'pending',
  
  -- Justificación del usuario
  reason TEXT,
  organization TEXT,
  
  -- Moderación
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Evitar solicitudes duplicadas pendientes
  UNIQUE(user_id, request_type, status)
);

-- 4. Índices
CREATE INDEX IF NOT EXISTS idx_permission_requests_user_id ON permission_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_permission_requests_status ON permission_requests(status);
CREATE INDEX IF NOT EXISTS idx_permission_requests_type ON permission_requests(request_type);

-- 5. Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_permission_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Trigger para updated_at
DROP TRIGGER IF EXISTS update_permission_requests_updated_at ON permission_requests;
CREATE TRIGGER update_permission_requests_updated_at
    BEFORE UPDATE ON permission_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_permission_requests_updated_at();

-- 7. Desactivar RLS (para desarrollo)
ALTER TABLE permission_requests DISABLE ROW LEVEL SECURITY;

-- 8. Verificación
SELECT 
  'permission_requests table created' as status,
  EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'permission_requests') as exists;
