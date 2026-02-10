import type { Metadata } from 'next';
import { LegalPage } from '@/components/landing/LegalPage';

export const metadata: Metadata = {
  title: 'Aviso Legal | MotoEvents',
};

export default function AvisoLegalPage() {
  return (
    <LegalPage title="Aviso Legal" lastUpdated="febrero 2026">
      <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 text-sm text-orange-800 dark:text-orange-200">
        📝 Pendiente de contenido definitivo. Obligatorio por la Ley 34/2002 de Servicios de la Sociedad de la Información (LSSI).
      </div>
      <section>
        <h2 className="text-lg font-bold text-foreground mb-2">Datos del Titular</h2>
        <ul className="space-y-1">
          <li><strong>Denominación social:</strong> [Nombre o razón social]</li>
          <li><strong>NIF/CIF:</strong> [NIF]</li>
          <li><strong>Domicilio:</strong> [Dirección completa], [CP], [Ciudad], España</li>
          <li><strong>Correo electrónico:</strong> [email de contacto]</li>
          <li><strong>Teléfono:</strong> [teléfono]</li>
          <li><strong>Registro Mercantil:</strong> [datos de inscripción si aplica]</li>
        </ul>
      </section>
      <section>
        <h2 className="text-lg font-bold text-foreground mb-2">Objeto</h2>
        <p>En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico, se informa al usuario de los datos del titular del sitio web motoevents.es.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-foreground mb-2">Propiedad Intelectual e Industrial</h2>
        <p>Los contenidos del sitio web (textos, imágenes, código fuente, diseño, marca) son propiedad de [titular] o de sus licenciantes, y están protegidos por la legislación española e internacional sobre propiedad intelectual e industrial.</p>
      </section>
    </LegalPage>
  );
}
