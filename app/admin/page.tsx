// @ts-nocheck
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Shield, Clock, CheckCircle, XCircle,
  User, Mail, RefreshCw, AlertTriangle, Loader2
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

interface PermissionRequest {
  id: string;
  user_id: string;
  request_type: 'contributor' | 'moderator';
  status: 'pending' | 'approved' | 'rejected';
  reason: string | null;
  rejection_reason: string | null;
  created_at: string;
  reviewed_at: string | null;
  profiles: {
    id: string;
    email: string;
    full_name: string | null;
    role: string;
    can_submit_events: boolean;
    can_moderate_events: boolean;
  };
}

const REQUEST_TYPE_LABELS = {
  contributor: 'Colaborador',
  moderator: 'Moderador',
};

const STATUS_CONFIG = {
  pending:  { label: 'Pendiente',  className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' },
  approved: { label: 'Aprobado',   className: 'bg-green-100  dark:bg-green-900/30  text-green-800  dark:text-green-200'  },
  rejected: { label: 'Rechazado',  className: 'bg-red-100    dark:bg-red-900/30    text-red-800    dark:text-red-200'    },
};

export default function AdminPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  const [requests, setRequests] = useState<PermissionRequest[]>([]);
  const [fetching, setFetching] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Guard: solo admins
  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'admin')) {
      router.push('/');
    }
  }, [loading, user, profile, router]);

  const fetchRequests = useCallback(async () => {
    setFetching(true);
    try {
      const res = await fetch(`/api/permission-requests?status=${statusFilter}`);
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch {
      setMessage({ type: 'error', text: 'Error al cargar solicitudes' });
    } finally {
      setFetching(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    if (profile?.role === 'admin') fetchRequests();
  }, [fetchRequests, profile]);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    let rejection_reason: string | null = null;

    if (action === 'reject') {
      rejection_reason = prompt('Motivo del rechazo (opcional):') ?? null;
    }

    setActionLoading(id);
    setMessage(null);

    try {
      const res = await fetch(`/api/permission-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          reviewed_by: user?.id,
          rejection_reason,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? 'Error desconocido');

      setMessage({
        type: 'success',
        text: action === 'approve' ? 'Solicitud aprobada ✓' : 'Solicitud rechazada',
      });
      await fetchRequests();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  // Loading / guard states
  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-moto-orange" />
      </div>
    );
  }

  if (profile.role !== 'admin') return null;

  const pendingCount = requests.filter(r => r.status === 'pending').length;

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
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-moto-orange" />
            <h1 className="text-lg font-bold">
              <span className="text-moto-orange">Moto</span>Events · Admin
            </h1>
          </div>
        </div>
      </header>

      <div className="container max-w-5xl py-8">
        {/* Título */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Panel de Administración</h2>
          <p className="text-muted-foreground mt-1">
            Gestión de solicitudes de permisos de usuarios
          </p>
        </div>

        {/* Mensaje */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900'
              : 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900'
          }`}>
            {message.type === 'success'
              ? <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              : <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            }
            <p className={`text-sm ${
              message.type === 'success' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
            }`}>
              {message.text}
            </p>
          </div>
        )}

        {/* Filtros + Refresh */}
        <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
          <div className="flex gap-2">
            {(['pending', 'approved', 'rejected', 'all'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  statusFilter === s
                    ? 'bg-moto-orange text-white'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {{
                  pending: `Pendientes${pendingCount > 0 && statusFilter !== 'pending' ? ` (${pendingCount})` : ''}`,
                  approved: 'Aprobadas',
                  rejected: 'Rechazadas',
                  all: 'Todas',
                }[s]}
              </button>
            ))}
          </div>
          <button
            onClick={fetchRequests}
            disabled={fetching}
            className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-muted hover:bg-muted/80 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${fetching ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>

        {/* Lista de solicitudes */}
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          {fetching ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-moto-orange" />
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
              <CheckCircle className="w-10 h-10 opacity-30" />
              <p className="text-sm">No hay solicitudes {statusFilter !== 'all' ? STATUS_CONFIG[statusFilter]?.label.toLowerCase() + 's' : ''}</p>
            </div>
          ) : (
            <div className="divide-y">
              {requests.map((req) => (
                <div key={req.id} className="p-5 hover:bg-muted/20 transition-colors">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    {/* Info usuario */}
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-moto-orange/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-moto-orange" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">
                          {req.profiles?.full_name ?? 'Sin nombre'}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{req.profiles?.email}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          {/* Rol actual */}
                          <span className="px-2 py-0.5 text-xs rounded-full bg-muted font-medium">
                            Rol actual: {req.profiles?.role}
                          </span>
                          {/* Tipo solicitado */}
                          <span className="px-2 py-0.5 text-xs rounded-full bg-moto-orange/10 text-moto-orange font-medium">
                            Solicita: {REQUEST_TYPE_LABELS[req.request_type]}
                          </span>
                          {/* Estado */}
                          <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${STATUS_CONFIG[req.status]?.className}`}>
                            {STATUS_CONFIG[req.status]?.label}
                          </span>
                        </div>
                        {/* Motivo del usuario */}
                        {req.reason && (
                          <p className="mt-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                            "{req.reason}"
                          </p>
                        )}
                        {/* Motivo de rechazo */}
                        {req.rejection_reason && (
                          <p className="mt-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 rounded-lg px-3 py-2">
                            Rechazado: {req.rejection_reason}
                          </p>
                        )}
                        {/* Fecha */}
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {new Date(req.created_at).toLocaleString('es-ES', {
                            year: 'numeric', month: 'short', day: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Acciones (solo pendientes) */}
                    {req.status === 'pending' && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleAction(req.id, 'approve')}
                          disabled={actionLoading === req.id}
                          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors disabled:opacity-50"
                        >
                          {actionLoading === req.id
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <CheckCircle className="w-4 h-4" />
                          }
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleAction(req.id, 'reject')}
                          disabled={actionLoading === req.id}
                          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" />
                          Rechazar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
