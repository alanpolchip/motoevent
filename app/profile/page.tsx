// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Shield, Edit2, Save, X, Loader2, CheckCircle, AlertCircle, Camera } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { ROLE_LABELS, ROLE_PERMISSIONS } from '@/types/auth';
import { createClient } from '@/lib/supabase/client';

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, refreshProfile, loading } = useAuth();
  const supabase = createClient();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form state
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Permission requests state
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [requestingPermission, setRequestingPermission] = useState(false);

  // Load profile data
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  // Load pending permission requests (solo cuando el usuario lo pide)
  // No cargar automáticamente para no ralentizar la página
  // useEffect(() => {
  //   if (user && !loading) {
  //     loadPendingRequests();
  //   }
  // }, [user, loading]);

  // Check if permission_requests table exists
  const [tableExists, setTableExists] = useState(true);

  const loadPendingRequests = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('permission_requests')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPendingRequests(data);
        setTableExists(true);
      } else if (error) {
        setTableExists(false);
      }
    } catch (error) {
      console.log('Error loading permission requests (table may not exist yet):', error);
      setTableExists(false);
    }
  };

  // Redirect if not authenticated (pero esperar a que termine de cargar)
  useEffect(() => {
    // Solo redirigir si terminó de cargar Y no hay usuario
    if (!loading && !user) {
      router.push('/');
    }
  }, [loading, user, router]);

  // Upload avatar to Supabase Storage
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validar tipo y tamaño (max 2MB)
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Solo se permiten imágenes' });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'La imagen no puede superar 2MB' });
      return;
    }

    setIsUploadingAvatar(true);
    setMessage(null);

    try {
      const ext = file.name.split('.').pop();
      const path = `avatars/${user.id}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(path);

      // Guardar URL en perfil
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      await refreshProfile();
      setMessage({ type: 'success', text: 'Avatar actualizado' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error al subir imagen' });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName || null,
          avatar_url: avatarUrl || null,
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al actualizar perfil' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRequestPermission = async (type: 'contributor' | 'moderator') => {
    if (!user) return;

    // Check if already has permission
    if (type === 'contributor' && profile?.can_submit_events) {
      setMessage({ type: 'error', text: 'Ya tienes permisos de colaborador' });
      return;
    }
    if (type === 'moderator' && profile?.can_moderate_events) {
      setMessage({ type: 'error', text: 'Ya tienes permisos de moderador' });
      return;
    }

    // Check if already has pending request
    const hasPending = pendingRequests.some(r => r.request_type === type);
    if (hasPending) {
      setMessage({ type: 'error', text: 'Ya tienes una solicitud pendiente de este tipo' });
      return;
    }

    const reason = prompt(`¿Por qué quieres ser ${type === 'contributor' ? 'colaborador' : 'moderador'}?`);
    if (!reason) return;

    setRequestingPermission(true);

    try {
      const { error } = await supabase
        .from('permission_requests')
        .insert({
          user_id: user.id,
          request_type: type,
          reason,
        });

      if (error) {
        // Si la tabla no existe, mostrar mensaje informativo
        if (error.message?.includes('permission_requests')) {
          throw new Error('El sistema de solicitudes aún no está configurado. Contacta al administrador.');
        }
        throw error;
      }

      setMessage({ type: 'success', text: 'Solicitud enviada correctamente' });
      await loadPendingRequests();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al enviar solicitud' });
    } finally {
      setRequestingPermission(false);
    }
  };

  // Mostrar loading mientras carga
  if (loading || !user || !profile) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-moto-orange mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  const roleLabel = ROLE_LABELS[profile.role] ?? profile.role;
  const permissions = ROLE_PERMISSIONS[profile.role] ?? ROLE_PERMISSIONS['viewer'];

  return (
    <main className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al calendario
          </Link>
          <h1 className="text-lg font-bold">
            <span className="text-moto-orange">Moto</span>Events
          </h1>
        </div>
      </header>

      <div className="container max-w-4xl py-8">
        {/* Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
            message.type === 'success' 
              ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900' 
              : 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            )}
            <p className={`text-sm ${
              message.type === 'success' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
            }`}>
              {message.text}
            </p>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-card rounded-xl border shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Mi Perfil</h2>
              <p className="text-muted-foreground mt-1">
                Gestiona tu información personal y permisos
              </p>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFullName(profile.full_name || '');
                    setAvatarUrl(profile.avatar_url || '');
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  disabled={isSaving}
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-moto-orange hover:bg-moto-orange-dark text-white transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Guardar
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-moto-orange flex items-center justify-center text-4xl font-bold text-white overflow-hidden">
                  {isUploadingAvatar ? (
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                  ) : avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{(fullName || user.email || 'U').charAt(0).toUpperCase()}</span>
                  )}
                </div>
                {/* Botón de upload siempre visible (no solo en modo edición) */}
                <label className="absolute bottom-0 right-0 w-9 h-9 bg-moto-orange hover:bg-moto-orange-dark rounded-full flex items-center justify-center cursor-pointer shadow-md transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={isUploadingAvatar}
                  />
                </label>
              </div>
              <p className="text-xs text-muted-foreground">Máx. 2MB</p>
            </div>

            {/* Info */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">
                  Nombre completo
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full px-3 py-2 border rounded-lg bg-background"
                  />
                ) : (
                  <p className="text-lg font-medium">{fullName || 'Sin nombre'}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">
                  Email
                </label>
                <p className="text-lg">{user.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">
                  Tipo de cuenta
                </label>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-moto-orange/10 text-moto-orange rounded-full">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">{roleLabel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Permissions Card */}
        <div className="bg-card rounded-xl border shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Permisos de la Cuenta</h3>
          
          <div className="space-y-3 mb-6">
            {permissions.map((permission, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">{permission}</span>
              </div>
            ))}
          </div>

          {/* Request Permissions - Solo si la tabla existe */}
          {tableExists && !profile.can_submit_events && (
            <div className="border-t pt-4 mb-4">
              <h4 className="font-medium mb-2">Solicitar Permisos de Colaborador</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Los colaboradores pueden enviar eventos para moderación.
              </p>
              <button
                onClick={() => handleRequestPermission('contributor')}
                disabled={requestingPermission}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-moto-orange hover:bg-moto-orange-dark text-white transition-colors disabled:opacity-50"
              >
                {requestingPermission ? 'Enviando...' : 'Solicitar Permisos'}
              </button>
            </div>
          )}

          {tableExists && profile.can_submit_events && !profile.can_moderate_events && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Solicitar Permisos de Moderador</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Los moderadores pueden aprobar o rechazar eventos enviados.
              </p>
              <button
                onClick={() => handleRequestPermission('moderator')}
                disabled={requestingPermission}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-moto-orange hover:bg-moto-orange-dark text-white transition-colors disabled:opacity-50"
              >
                {requestingPermission ? 'Enviando...' : 'Solicitar Permisos'}
              </button>
            </div>
          )}

          {/* Info si la tabla no existe */}
          {!tableExists && !profile.can_submit_events && (
            <div className="border-t pt-4 mt-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  💡 Para solicitar permisos adicionales, contacta con un administrador o ejecuta la migración <code className="text-xs bg-background px-1 py-0.5 rounded">create-permission-requests.sql</code>
                </p>
              </div>
            </div>
          )}

          {/* Pending Requests */}
          {tableExists && pendingRequests.length > 0 && (
            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium mb-3">Solicitudes Pendientes</h4>
              <div className="space-y-2">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">
                        {request.request_type === 'contributor' ? 'Colaborador' : 'Moderador'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Enviada el {new Date(request.created_at).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded">
                      Pendiente
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="bg-card rounded-xl border shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Información de la Cuenta</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Registrado</span>
              <span>{new Date(profile.created_at).toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            {profile.last_login_at && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Último acceso</span>
                <span>{new Date(profile.last_login_at).toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
