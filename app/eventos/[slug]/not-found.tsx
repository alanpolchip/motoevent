import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function EventNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <h1 className="text-6xl font-bold text-moto-orange">404</h1>
        <h2 className="text-2xl font-bold">Evento no encontrado</h2>
        <p className="text-muted-foreground">
          El evento que buscas no existe o ha sido eliminado.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-moto-orange text-white hover:bg-moto-orange-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al calendario
        </Link>
      </div>
    </div>
  );
}
