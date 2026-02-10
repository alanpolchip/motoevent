import type { Metadata } from 'next';
import { LegalPage } from '@/components/landing/LegalPage';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | MotoEvents',
  description: 'Términos y condiciones de uso de MotoEvents.',
};

export default function TerminosPage() {
  return (
    <LegalPage title="Términos y Condiciones" lastUpdated="febrero 2026">
      <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 text-sm text-orange-800 dark:text-orange-200">
        📝 Pendiente de contenido definitivo.
      </div>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-2">1. Objeto y Aceptación</h2>
        <p>El uso de MotoEvents implica la aceptación de estos Términos y Condiciones. Si no estás de acuerdo, te rogamos que no utilices la plataforma.</p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-2">2. Descripción del Servicio</h2>
        <p>MotoEvents es una plataforma de agregación y publicación de eventos moteros. El acceso al calendario es gratuito. La publicación de eventos requiere registro y aprobación.</p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-2">3. Condiciones de Publicación de Eventos</h2>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Los eventos publicados deben ser reales y estar verificados</li>
          <li>Está prohibido publicar contenido engañoso, spam o eventos inexistentes</li>
          <li>Los organizadores son responsables de la veracidad de la información</li>
          <li>MotoEvents se reserva el derecho a rechazar o eliminar eventos</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-2">4. Propiedad Intelectual</h2>
        <p>[Completar: titularidad de contenidos, licencias de uso, marca registrada]</p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-2">5. Limitación de Responsabilidad</h2>
        <p>MotoEvents actúa como plataforma intermediaria. No se hace responsable de la cancelación, modificación o cualquier incidencia relacionada con los eventos publicados por terceros.</p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-2">6. Ley Aplicable y Jurisdicción</h2>
        <p>Estos términos se rigen por la legislación española. Para cualquier controversia, las partes se someten a los Juzgados y Tribunales de [ciudad], renunciando a cualquier otro fuero.</p>
      </section>
    </LegalPage>
  );
}
