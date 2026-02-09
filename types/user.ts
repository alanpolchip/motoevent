// ============================================
// TIPOS DE USUARIO - MotoEvents Calendar
// ============================================

export type UserRole = 'user' | 'moderator' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  user: {
    id: string;
    email: string;
  } | null;
  profile: Profile | null;
}
