'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { User, LogOut, UserCircle, Shield, Settings } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { AuthModal } from './AuthModal';
import { ROLE_LABELS } from '@/types/auth';

export function UserButton() {
  const { user, profile, signOut, isAdmin, canModerateEvents } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  // Calcular posición del dropdown relativa al viewport
  const openDropdown = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.top, left: rect.right + 8 });
    }
    setShowDropdown(true);
  };

  // Usuario no autenticado
  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowAuthModal(true)}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted hover:bg-muted/80 transition-colors group relative"
          title="Iniciar Sesión"
        >
          <User className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          
          {/* Tooltip */}
          <span className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Iniciar Sesión
          </span>
        </button>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  // Usuario autenticado
  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Usuario';
  const roleLabel = profile?.role ? ROLE_LABELS[profile.role] : 'Usuario';

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={openDropdown}
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-moto-orange hover:bg-moto-orange-dark transition-colors group relative"
        title={displayName}
      >
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={displayName}
            className="w-full h-full rounded-lg object-cover"
          />
        ) : (
          <span className="text-white font-bold text-sm">
            {displayName.charAt(0).toUpperCase()}
          </span>
        )}

        {/* Tooltip */}
        <span className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {displayName}
        </span>
      </button>

      {/* Dropdown — portal a document.body para evitar stacking context del sidebar */}
      {showDropdown && typeof document !== 'undefined' && createPortal(
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setShowDropdown(false)} />
          <div
            className="fixed w-64 bg-card border rounded-lg shadow-xl z-[9999] py-2"
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
          >
            {/* User Info */}
            <div className="px-4 py-3 border-b">
              <p className="font-medium text-sm truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-moto-orange/10 text-moto-orange text-xs rounded-full">
                <Shield className="w-3 h-3" />
                {roleLabel}
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <Link
                href="/profile"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
              >
                <UserCircle className="w-4 h-4" />
                Mi Perfil
              </Link>

              {isAdmin && (
                <Link
                  href="/admin/users"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Panel de Admin
                </Link>
              )}

              <button
                onClick={() => {
                  signOut();
                  setShowDropdown(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
