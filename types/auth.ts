// ============================================
// TIPOS DE AUTENTICACIÓN - MotoEvents Calendar
// ============================================

import { User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'viewer' | 'contributor' | 'moderator' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  can_submit_events: boolean;
  can_moderate_events: boolean;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
}

export interface AuthUser extends SupabaseUser {
  profile?: UserProfile;
}

export interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  canSubmitEvents: boolean;
  canModerateEvents: boolean;
  isAdmin: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName?: string;
}

export interface ChangeRoleData {
  userId: string;
  newRole: UserRole;
}

// Jerarquía de roles (para comparaciones)
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  viewer: 0,
  contributor: 1,
  moderator: 2,
  admin: 3,
};

// Labels legibles para roles
export const ROLE_LABELS: Record<UserRole, string> = {
  viewer: 'Espectador',
  contributor: 'Colaborador',
  moderator: 'Moderador',
  admin: 'Administrador',
};

// Descripción de permisos por rol
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  viewer: [
    'Ver eventos públicos',
    'Marcar favoritos (próximamente)',
    'Exportar a calendario (próximamente)',
  ],
  contributor: [
    'Todo lo de Espectador',
    'Enviar eventos para moderación',
    'Ver mis eventos enviados',
  ],
  moderator: [
    'Todo lo de Colaborador',
    'Acceder al panel de moderación',
    'Aprobar/rechazar eventos',
    'Ver todos los eventos pendientes',
  ],
  admin: [
    'Todo lo de Moderador',
    'Gestionar usuarios y roles',
    'Acceder al dashboard de administración',
    'Configuración global del sitio',
  ],
};

// Helper para verificar si un rol es mayor o igual que otro
export function hasRoleLevel(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}
