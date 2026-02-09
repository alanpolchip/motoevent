'use client';

import { useState, useEffect } from 'react';
import { Shield, User } from 'lucide-react';

export type UserRole = 'admin' | 'user';

export function RoleSelector() {
  const [role, setRole] = useState<UserRole>('admin');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load role from localStorage on mount
    const savedRole = localStorage.getItem('debug_user_role') as UserRole;
    if (savedRole && (savedRole === 'admin' || savedRole === 'user')) {
      setRole(savedRole);
    } else {
      // Default to admin if not set
      localStorage.setItem('debug_user_role', 'admin');
    }
  }, []);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('debug_user_role', newRole);
    setIsOpen(false);
    // Reload page to apply changes
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg border-2 transition-all ${
            role === 'admin'
              ? 'bg-purple-100 border-purple-500 text-purple-800 hover:bg-purple-200'
              : 'bg-blue-100 border-blue-500 text-blue-800 hover:bg-blue-200'
          }`}
        >
          {role === 'admin' ? (
            <Shield className="w-4 h-4" />
          ) : (
            <User className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            {role === 'admin' ? 'Admin Mode' : 'User Mode'}
          </span>
        </button>

        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-2 bg-gray-50 border-b border-gray-200">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Debug Mode
              </span>
            </div>
            <button
              onClick={() => handleRoleChange('admin')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                role === 'admin' ? 'bg-purple-50 text-purple-800' : 'text-gray-700'
              }`}
            >
              <Shield className="w-5 h-5" />
              <div>
                <div className="font-medium">Admin</div>
                <div className="text-xs text-gray-500">Full access</div>
              </div>
              {role === 'admin' && (
                <div className="ml-auto w-2 h-2 bg-purple-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => handleRoleChange('user')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                role === 'user' ? 'bg-blue-50 text-blue-800' : 'text-gray-700'
              }`}
            >
              <User className="w-5 h-5" />
              <div>
                <div className="font-medium">User</div>
                <div className="text-xs text-gray-500">Limited access</div>
              </div>
              {role === 'user' && (
                <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get current role
export function getCurrentRole(): UserRole {
  if (typeof window === 'undefined') return 'admin';
  const savedRole = localStorage.getItem('debug_user_role') as UserRole;
  return savedRole === 'user' ? 'user' : 'admin';
}
