import type { Metadata } from 'next';
import { LegalPage } from '@/components/landing/LegalPage';

export const metadata: Metadata = {
  title: 'Política de Privacidad | MotoEvents',
  description: 'Política de privacidad de MotoEvents. Cómo recogemos, usamos y protegemos tus datos personales.',
};

export default function PrivacidadPage() {
  return (
    <LegalPage title="Política de Privacidad" lastUpdated="febrero 2026">
      <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 text-sm text-orange-800 dark:text-orange-200">
        📝 Esta página está pendiente de contenido definitivo. Se completará próximamente con información conforme al RGPD y la LOPDGDD.
      </div>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-2">1. Responsable del Tratamiento</h2>
        <p>[Nombre/Razón social], [NIF], con domicilio en [dirección], [ciudad], España.</p>
        <p>Contacto DPD: [email de privacidad]</p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-2">2. Datos que Recogemos</h2>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Datos de registro: nombre, dirección de correo electrónico</li>
          <li>Datos de uso: interacciones con el calendario, filtros aplicados</li>
          <li>Datos técnicos: dirección IP, tipo de navegador, dispositivo</li>
          <li>Cookies y tecnologías similares (ver Política de Cookies)</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-2">3. Finalidades y Base Legal</h2>
        <p>[Completar con las finalidades específicas y su base legal según el RGPD Art. 6]</p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-2">4. Conservación de Datos</h2>
        <p>[Completar con los plazos de conservación por finalidad]</p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-2">5. Tus Derechos</h2>
        <p>Puedes ejercer tus derechos de acceso, rectificación, supresión, limitación, portabilidad y oposición escribiendo a [email]. También puedes reclamar ante la AEPD (aepd.es).</p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-foreground mb-2">6. Transferencias Internacionales</h2>
        <p>[Completar si se realizan transferencias fuera del EEE]</p>
      </section>
    </LegalPage>
  );
}
