import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, Mail, MessageSquare, Building } from 'lucide-react';
import { Footer } from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Contacto | MotoEvents',
  description: 'Contacta con el equipo de MotoEvents. Soporte, colaboraciones, patrocinios y prensa.',
};

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b bg-card">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <div className="w-7 h-7 rounded-full bg-moto-orange flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <circle cx="5.5" cy="17.5" r="3.5" />
                <circle cx="18.5" cy="17.5" r="3.5" />
                <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2" />
              </svg>
            </div>
            MotoEvents
          </Link>
          <Link href="/info" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" /> Volver
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 w-full">
        <span className="inline-block px-3 py-1 bg-moto-orange/10 text-moto-orange text-xs font-bold uppercase tracking-widest rounded-full mb-4">
          Contacto
        </span>
        <h1 className="text-3xl font-extrabold mb-2">Hablemos</h1>
        <p className="text-muted-foreground mb-10">
          Estamos aquí para ayudarte. Elige el canal que mejor se adapte a tu consulta.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <div className="border rounded-xl p-5 text-center">
            <Mail className="w-8 h-8 text-moto-orange mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Email General</h3>
            <p className="text-xs text-muted-foreground mb-2">Para soporte y dudas generales</p>
            <a href="mailto:hola@motoevents.es" className="text-moto-orange text-sm font-medium hover:underline">
              hola@motoevents.es
            </a>
          </div>
          <div className="border rounded-xl p-5 text-center">
            <Building className="w-8 h-8 text-moto-orange mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Marcas y Patrocinios</h3>
            <p className="text-xs text-muted-foreground mb-2">Colaboraciones comerciales</p>
            <a href="mailto:marcas@motoevents.es" className="text-moto-orange text-sm font-medium hover:underline">
              marcas@motoevents.es
            </a>
          </div>
          <div className="border rounded-xl p-5 text-center">
            <MessageSquare className="w-8 h-8 text-moto-orange mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Prensa</h3>
            <p className="text-xs text-muted-foreground mb-2">Medios y comunicación</p>
            <a href="mailto:prensa@motoevents.es" className="text-moto-orange text-sm font-medium hover:underline">
              prensa@motoevents.es
            </a>
          </div>
        </div>

        {/* Formulario de contacto — pendiente de implementar */}
        <div className="bg-card border rounded-xl p-6">
          <h2 className="font-bold text-lg mb-1">Formulario de Contacto</h2>
          <p className="text-sm text-muted-foreground mb-4">
            📝 Formulario pendiente de implementación. Por ahora, usa los emails de arriba.
          </p>
          <div className="space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <input disabled placeholder="Tu nombre" className="w-full px-3 py-2 border rounded-lg text-sm bg-muted/30 opacity-50 cursor-not-allowed" />
              <input disabled placeholder="Tu email" className="w-full px-3 py-2 border rounded-lg text-sm bg-muted/30 opacity-50 cursor-not-allowed" />
            </div>
            <input disabled placeholder="Asunto" className="w-full px-3 py-2 border rounded-lg text-sm bg-muted/30 opacity-50 cursor-not-allowed" />
            <textarea disabled placeholder="Tu mensaje..." rows={4} className="w-full px-3 py-2 border rounded-lg text-sm bg-muted/30 opacity-50 cursor-not-allowed resize-none" />
            <button disabled className="px-5 py-2.5 bg-moto-orange/50 text-white font-semibold rounded-lg cursor-not-allowed text-sm">
              Enviar mensaje (próximamente)
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
