import { Metadata } from 'next';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import { ArrowLeft, Calendar } from 'lucide-react';
import { SubmitEventForm } from './SubmitEventForm';

export const metadata: Metadata = {
  title: `Publicar Evento | ${APP_NAME}`,
  description: 'Envía tu evento motero para aparecer en nuestro calendario',
};

export default function SubmitEventPage() {
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

      <div className="container max-w-3xl py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-moto-orange/10 mb-4">
            <Calendar className="w-6 h-6 text-moto-orange" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Publicar Evento</h2>
          <p className="text-muted-foreground mt-2">
            Completa el formulario para enviar tu evento motero. Será revisado antes de publicarse.
          </p>
        </div>

        <div className="bg-card rounded-xl border shadow-sm p-6 md:p-8">
          <SubmitEventForm />
        </div>
      </div>
    </main>
  );
}
