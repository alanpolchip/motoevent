import Link from 'next/link';

const FOOTER_LINKS = {
  producto: [
    { label: 'Calendario de Eventos', href: '/' },
    { label: 'Cómo funciona', href: '/info#como-funciona' },
    { label: 'Publicar un Evento', href: '/submit-evento' },
    { label: 'Para Marcas y Patrocinadores', href: '/info#marcas' },
  ],
  comunidad: [
    { label: 'Sobre MotoEvents', href: '/sobre-nosotros' },
    { label: 'Contacto', href: '/contacto' },
    { label: 'Blog', href: '/blog' },
  ],
  legal: [
    { label: 'Aviso Legal', href: '/legal/aviso-legal' },
    { label: 'Política de Privacidad', href: '/legal/privacidad' },
    { label: 'Términos y Condiciones', href: '/legal/terminos' },
    { label: 'Política de Cookies', href: '/legal/cookies' },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-card border-t">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Grid de columnas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-moto-orange flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <circle cx="5.5" cy="17.5" r="3.5" />
                  <circle cx="18.5" cy="17.5" r="3.5" />
                  <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2" />
                </svg>
              </div>
              <span className="font-bold text-lg">MotoEvents</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              El calendario unificado de eventos moteros de España. Concentraciones, rutas, competiciones y más.
            </p>
          </div>

          {/* Producto */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Producto</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.producto.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Comunidad */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Comunidad</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.comunidad.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Legal</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.legal.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {year} MotoEvents. Todos los derechos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Hecho con ❤️ para la comunidad motera española
          </p>
        </div>
      </div>
    </footer>
  );
}
