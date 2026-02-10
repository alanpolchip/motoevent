// @ts-nocheck
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { AuthContextType, UserProfile, AuthUser, UserRole } from '@/types/auth';
import { hasRoleLevel } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  // Cargar perfil del usuario (crea uno si no existe)
  const loadProfile = async (userId: string) => {
    try {
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Si no existe el perfil, crearlo (el trigger puede haber fallado)
      if (error && error.code === 'PGRST116') {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: authUser?.email ?? '',
            role: 'user',
            can_submit_events: false,
            can_moderate_events: false,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        data = newProfile;
      } else if (error) {
        throw error;
      }

      setProfile(data);

      // Actualizar last_login_at
      await supabase
        .from('profiles')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', userId);

      return data;
    } catch (error) {
      console.error('Error loading profile:', error);
      return null;
    }
  };

  // Inicializar sesión
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user as AuthUser);
          await loadProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user as AuthUser);
          await loadProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign In
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        setUser(data.user as AuthUser);
        await loadProfile(data.user.id);
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  };

  // Sign Up
  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || null,
          },
        },
      });

      if (error) throw error;

      // Nota: El profile se crea automáticamente por el trigger
      // La verificación de email es necesaria antes de poder usar la cuenta
      
      return data;
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message || 'Error al registrarse');
    }
  };

  // Sign Out
  const signOut = async () => {
    // Limpiar estado local inmediatamente para respuesta instantánea en UI
    setUser(null);
    setProfile(null);
    router.push('/');
    // Invalidar sesión en Supabase en background
    supabase.auth.signOut().catch((err) => {
      console.error('Sign out error:', err);
    });
  };

  // Refrescar perfil
  const refreshProfile = async () => {
    if (user?.id) {
      await loadProfile(user.id);
    }
  };

  // Verificar rol
  const hasRole = (requiredRole: UserRole): boolean => {
    if (!profile) return false;
    return hasRoleLevel(profile.role, requiredRole);
  };

  // Permisos específicos
  const canSubmitEvents = profile?.can_submit_events ?? false;
  const canModerateEvents = profile?.can_moderate_events ?? false;
  const isAdmin = profile?.role === 'admin';

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    hasRole,
    canSubmitEvents,
    canModerateEvents,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
