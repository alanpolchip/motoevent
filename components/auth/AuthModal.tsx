'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import type { LoginFormData, SignUpFormData } from '@/types/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(defaultTab);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [signupForm, setSignupForm] = useState<SignUpFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });

  if (!isOpen || typeof document === 'undefined') return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      await signIn(loginForm.email, loginForm.password);
      setSuccess('¡Bienvenido de vuelta!');
      setTimeout(() => {
        onClose();
        setLoginForm({ email: '', password: '' });
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validaciones
    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (signupForm.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsSubmitting(true);

    try {
      await signUp(signupForm.email, signupForm.password, signupForm.fullName);
      setSuccess('¡Cuenta creada! Revisa tu email para verificar tu cuenta.');
      setTimeout(() => {
        setSignupForm({ email: '', password: '', confirmPassword: '', fullName: '' });
        setActiveTab('login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta');
    } finally {
      setIsSubmitting(false);
    }
  };

  // createPortal → renderiza en document.body, fuera de cualquier stacking context
  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
        onClick={onClose}
      />

      {/* Modal — mobile: sheet desde abajo. Desktop: centrado */}
      <div className="fixed inset-0 flex items-end sm:items-center justify-center z-[9999] p-0 sm:p-4">
        <div className="bg-card border-t sm:border rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-md max-h-[92vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b">
            <h2 className="text-xl font-bold">
              {activeTab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h2>
            {/* Cruz visible para cerrar */}
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => {
                setActiveTab('login');
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'login'
                  ? 'text-moto-orange border-b-2 border-moto-orange'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => {
                setActiveTab('signup');
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'signup'
                  ? 'text-moto-orange border-b-2 border-moto-orange'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Registrarse
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-700 dark:text-green-400">{success}</p>
              </div>
            )}

            {/* Login Form */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="login-email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-moto-orange/20 focus:border-moto-orange"
                    placeholder="tu@email.com"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium mb-2">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="login-password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-moto-orange/20 focus:border-moto-orange"
                    placeholder="••••••••"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-moto-orange hover:bg-moto-orange-dark text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </button>
              </form>
            )}

            {/* Signup Form */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label htmlFor="signup-name" className="block text-sm font-medium mb-2">
                    Nombre completo <span className="text-xs text-muted-foreground">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    id="signup-name"
                    value={signupForm.fullName}
                    onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-moto-orange/20 focus:border-moto-orange"
                    placeholder="Tu nombre"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="signup-email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-moto-orange/20 focus:border-moto-orange"
                    placeholder="tu@email.com"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium mb-2">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="signup-password"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-moto-orange/20 focus:border-moto-orange"
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="signup-confirm" className="block text-sm font-medium mb-2">
                    Confirmar contraseña
                  </label>
                  <input
                    type="password"
                    id="signup-confirm"
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-moto-orange/20 focus:border-moto-orange"
                    placeholder="Repite tu contraseña"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-moto-orange hover:bg-moto-orange-dark text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    'Crear Cuenta'
                  )}
                </button>

                <p className="text-xs text-muted-foreground text-center">
                  Al registrarte, recibirás un email de verificación
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
