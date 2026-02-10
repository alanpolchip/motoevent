import type { Metadata } from 'next';
import { LegalPage } from '@/components/landing/LegalPage';

export const metadata: Metadata = {
  title: 'Política de Cookies | MotoEvents',
};

export default function CookiesPage() {
  return (
    <LegalPage title="Política de Cookies" lastUpdated="febrero 2026">
      <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 text-sm text-orange-800 dark:text-orange-200">
        📝 Pendiente de contenido definitivo.
      </div>
      <section>
        <h2 className="text-lg font-bold text-foreground mb-2">¿Qué son las cookies?</h2>
        <p>Las cookies son pequeños ficheros de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Nos permiten recordar tus preferencias y mejorar tu experiencia.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-foreground mb-2">Cookies que utilizamos</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="border px-3 py-2 text-left">Nombre</th>
                <th className="border px-3 py-2 text-left">Tipo</th>
                <th className="border px-3 py-2 text-left">Finalidad</th>
                <th className="border px-3 py-2 text-left">Duración</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-3 py-2">sb-[...]-auth-token</td>
                <td className="border px-3 py-2">Técnica</td>
                <td className="border px-3 py-2">Sesión de usuario (Supabase Auth)</td>
                <td className="border px-3 py-2">Sesión</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">[Añadir más]</td>
                <td className="border px-3 py-2">-</td>
                <td className="border px-3 py-2">-</td>
                <td className="border px-3 py-2">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="text-lg font-bold text-foreground mb-2">Cómo gestionar las cookies</h2>
        <p>Puedes configurar tu navegador para rechazar o eliminar cookies. Ten en cuenta que deshabilitar ciertas cookies puede afectar al funcionamiento de la plataforma.</p>
      </section>
    </LegalPage>
  );
}
