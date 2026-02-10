import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Footer } from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Sobre Nosotros | MotoEvents',
  description: 'Conoce el equipo detrás de MotoEvents, el calendario unificado de eventos moteros de España.',
};

export default function SobreNosotrosPage() {
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
          Sobre Nosotros
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
          Somos motoristas que querían una solución mejor
        </h1>

        {/* Placeholder — Alan rellenará esto */}
        <div className="bg-muted/30 border rounded-xl p-6 mb-8 text-sm text-muted-foreground">
          📝 <strong>Sección pendiente de contenido.</strong> Aquí irá la historia del proyecto, el equipo, la misión y los valores de MotoEvents.
        </div>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">Nuestra Historia</h2>
            <p>[Historia del proyecto — cómo surgió la idea, el problema que resuelve, cuándo empezó]</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">Nuestra Misión</h2>
            <p>[Misión: unificar la comunidad motera española, democratizar la visibilidad de eventos, etc.]</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">El Equipo</h2>
            <p>[Presentación del equipo — fotos, nombres, roles, background motero]</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">Nuestros Valores</h2>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Comunidad por encima de todo</li>
              <li>Transparencia y confianza</li>
              <li>Calidad del contenido</li>
              <li>Accesibilidad gratuita para usuarios</li>
            </ul>
          </section>
        </div>

        <div className="mt-10 flex gap-3">
          <Link href="/contacto" className="px-5 py-2.5 bg-moto-orange text-white font-semibold rounded-lg hover:bg-moto-orange-dark transition-colors text-sm flex items-center gap-1.5">
            Contactar <ChevronRight className="w-4 h-4" />
          </Link>
          <Link href="/" className="px-5 py-2.5 bg-muted text-foreground font-semibold rounded-lg hover:bg-muted/80 transition-colors text-sm">
            Ver el Calendario
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
