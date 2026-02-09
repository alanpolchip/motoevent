'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ProfileTestPage() {
  const { user, profile, loading } = useAuth();

  return (
    <div className="min-h-screen bg-muted/30 p-8">
      <Link href="/" className="text-moto-orange hover:underline mb-4 inline-block">
        ← Volver
      </Link>
      
      <div className="max-w-2xl mx-auto bg-card p-8 rounded-lg border">
        <h1 className="text-2xl font-bold mb-6">Test de Perfil</h1>
        
        <div className="space-y-4">
          <div>
            <strong>Loading:</strong> {loading ? '⏳ Sí' : '✅ No'}
          </div>
          
          <div>
            <strong>User:</strong> {user ? '✅ Sí' : '❌ No'}
            {user && (
              <pre className="mt-2 p-2 bg-muted rounded text-xs">
                {JSON.stringify({ id: user.id, email: user.email }, null, 2)}
              </pre>
            )}
          </div>
          
          <div>
            <strong>Profile:</strong> {profile ? '✅ Sí' : '❌ No'}
            {profile && (
              <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                {JSON.stringify(profile, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
