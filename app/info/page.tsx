import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/landing/Footer';
import {
  CalendarDays, MapPin, Filter, Eye, Users, Megaphone,
  TrendingUp, Globe, ShieldCheck, Star, ChevronRight,
  LayoutGrid, Layers, Columns, Square, Zap,
} from 'lucide-react';

// ─── SEO / Meta ──────────────────────────────────────────────────────────────
// Optimizado para: eventos moteros España, concentraciones motos, calendario motero
// GEO: España (es-ES), ciudades clave en el body para señales locales

export const metadata: Metadata = {
  title: 'MotoEvents | El Calendario Unificado de Eventos Moteros de España',
  description:
    'Descubre todos los eventos moteros de España en un solo lugar: concentraciones, rutas, competiciones y quedadas. Filtra por ciudad, tipo y fecha. Gratis para la comunidad motera.',
  keywords: [
    'eventos moteros España',
    'concentraciones motos',
    'calendario motero',
    'rutas moto España',
    'quedadas motos',
    'competiciones motos',
    'eventos moto Madrid',
    'eventos moto Barcelona',
    'motoeventos',
    'MotoEvents',
  ].join(', '),
  openGraph: {
    title: 'MotoEvents — Todos los eventos moteros de España',
    description: 'El calendario unificado de concentraciones, rutas y competiciones para la comunidad motera española.',
    type: 'website',
    locale: 'es_ES',
  },
};

// ─── Structured Data (JSON-LD) ────────────────────────────────────────────────
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'MotoEvents',
  description: 'Calendario unificado de eventos moteros en España',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Web',
  inLanguage: 'es-ES',
  audience: { '@type': 'Audience', audienceType: 'Motorcycle enthusiasts' },
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
};

// ─── Components ───────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block px-3 py-1 bg-moto-orange/10 text-moto-orange text-xs font-bold uppercase tracking-widest rounded-full mb-4">
      {children}
    </span>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="bg-card border rounded-xl p-5 flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 bg-moto-orange/10 rounded-lg flex items-center justify-center">
        <Icon className="w-5 h-5 text-moto-orange" />
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function ViewCard({ label, icon: Icon, desc }: { label: string; icon: React.ElementType; desc: string }) {
  return (
    <div className="border rounded-xl p-4 text-center bg-card hover:border-moto-orange/50 transition-colors">
      <div className="w-10 h-10 bg-moto-orange/10 rounded-lg flex items-center justify-center mx-auto mb-3">
        <Icon className="w-5 h-5 text-moto-orange" />
      </div>
      <div className="font-bold text-moto-orange mb-1">{label}</div>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-moto-orange text-white text-sm font-bold flex items-center justify-center">
        {n}
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-0.5">{title}</h3>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

function BenefitRow({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="flex gap-3 py-4 border-b last:border-b-0">
      <Icon className="w-5 h-5 text-moto-orange flex-shrink-0 mt-0.5" />
      <div>
        <h3 className="font-semibold text-sm">{title}</h3>
        <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InfoPage() {
  return (
    <>
      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-background text-foreground">

        {/* ── NAV ─────────────────────────────────────────────────────────── */}
        <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur border-b">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-moto-orange flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <circle cx="5.5" cy="17.5" r="3.5" />
                  <circle cx="18.5" cy="17.5" r="3.5" />
                  <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2" />
                </svg>
              </div>
              <span className="font-bold text-lg">MotoEvents</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1.5 px-4 py-2 bg-moto-orange hover:bg-moto-orange-dark text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Ver Calendario <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </nav>

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-moto-orange via-orange-600 to-orange-800 text-white">
          {/* Decorative circles */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-white/5 rounded-full" />

          <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
            <div className="max-w-3xl">
              <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-full mb-5">
                🏍️ Para la comunidad motera española
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-5">
                Todos los eventos<br />moteros de España<br />
                <span className="text-orange-200">en un solo lugar</span>
              </h1>
              <p className="text-lg md:text-xl text-orange-100 leading-relaxed mb-8 max-w-2xl">
                MotoEvents es el calendario unificado donde la comunidad motera encuentra concentraciones,
                rutas, competiciones y quedadas — organizadas, filtradas y siempre actualizadas.
                Desde Madrid hasta Galicia, de los Pirineos a Canarias.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/" className="px-6 py-3 bg-white text-moto-orange font-bold rounded-xl hover:bg-orange-50 transition-colors">
                  Abrir el Calendario
                </Link>
                <a href="#como-funciona" className="px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors border border-white/30">
                  Cómo funciona
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS STRIP ─────────────────────────────────────────────────── */}
        <section className="bg-card border-b">
          <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { n: '500+', label: 'Eventos al año' },
              { n: '50+', label: 'Provincias cubiertas' },
              { n: '5 vistas', label: 'Formatos de calendario' },
              { n: '100%', label: 'Gratuito para usuarios' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-2xl md:text-3xl font-extrabold text-moto-orange">{s.n}</div>
                <div className="text-sm text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── QUÉ ES MOTOEVENTS ────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionLabel>¿Qué es MotoEvents?</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-5">
                El punto de encuentro de la comunidad motera española
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                MotoEvents nace de una necesidad real: los eventos moteros en España estaban dispersos
                entre cientos de grupos de Facebook, foros y webs locales. Los motoristas perdían
                eventos por falta de información centralizada. Las organizaciones no llegaban a su público.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Nuestra plataforma unifica en un único calendario interactivo todos los eventos
                del mundo de la moto — desde la concentración local de tu pueblo hasta el gran
                evento nacional — con filtros por tipo, ciudad y fechas.
              </p>
              <Link href="/" className="inline-flex items-center gap-2 text-moto-orange font-semibold hover:gap-3 transition-all">
                Ver el calendario <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FeatureCard icon={CalendarDays} title="Calendario interactivo" desc="5 formatos de vista: día, 3 días, semana, quincena y mes." />
              <FeatureCard icon={Filter} title="Filtros avanzados" desc="Filtra por ciudad, tipo de evento y rango de fechas." />
              <FeatureCard icon={MapPin} title="Cobertura nacional" desc="Eventos en todas las provincias de España y Portugal." />
              <FeatureCard icon={Zap} title="Siempre actualizado" desc="Moderación activa para mantener la calidad del contenido." />
            </div>
          </div>
        </section>

        {/* ── VISTAS DEL CALENDARIO ────────────────────────────────────────── */}
        <section id="vistas" className="bg-muted/30 py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              <SectionLabel>Las 5 Vistas</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Tu calendario, a tu manera</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Navega los eventos en el formato que más te convenga. Cada vista está optimizada
                para un caso de uso diferente — y todas funcionan con gestos táctiles en móvil.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <ViewCard label="1D" icon={Square} desc="Un día completo. Perfecto para explorar eventos uno a uno con toda su información." />
              <ViewCard label="3D" icon={Columns} desc="Tres días en paralelo. Ideal para planificar un fin de semana de ruta." />
              <ViewCard label="1W" icon={LayoutGrid} desc="La semana completa de un vistazo. Ve qué hay cada día de la semana." />
              <ViewCard label="2W" icon={Layers} desc="Quincena. Planificación a medio plazo de tus salidas y concentraciones." />
              <ViewCard label="4W" icon={CalendarDays} desc="Vista mensual. Panorámica completa de todos los eventos del mes." />
            </div>
          </div>
        </section>

        {/* ── CÓMO FUNCIONA ────────────────────────────────────────────────── */}
        <section id="como-funciona" className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-16">

            {/* Para usuarios */}
            <div>
              <SectionLabel>Para usuarios</SectionLabel>
              <h2 className="text-2xl font-extrabold mb-6">Encuentra tu próxima ruta en segundos</h2>
              <div className="space-y-5">
                <Step n={1} title="Abre el calendario" desc="Sin registro, sin instalación. El calendario está disponible desde el primer momento en cualquier dispositivo." />
                <Step n={2} title="Elige tu vista" desc="Selecciona la vista que mejor se adapte a lo que buscas: día, semana o mes." />
                <Step n={3} title="Filtra por lo que te interesa" desc="Usa los filtros de ubicación y tipo de evento para ver solo lo relevante para ti." />
                <Step n={4} title="Explora el evento" desc="Haz clic en cualquier evento para ver toda la información: descripción, horarios, ubicación y cómo llegar." />
              </div>
            </div>

            {/* Para organizadores */}
            <div>
              <SectionLabel>Para organizadores</SectionLabel>
              <h2 className="text-2xl font-extrabold mb-6">Publica tu evento y llega a miles de motoristas</h2>
              <div className="space-y-5">
                <Step n={1} title="Crea tu cuenta" desc="Regístrate y solicita permisos de publicación. Revisamos cada solicitud para mantener la calidad." />
                <Step n={2} title="Publica tu evento" desc="Rellena el formulario con título, fechas, ubicación, tipo de evento e imagen. En menos de 5 minutos." />
                <Step n={3} title="Revisión por moderadores" desc="Nuestro equipo revisa el evento antes de publicarlo para garantizar información correcta." />
                <Step n={4} title="Tu evento, visible para toda la comunidad" desc="Una vez aprobado, aparece automáticamente en el calendario para todos los usuarios." />
              </div>
            </div>
          </div>
        </section>

        {/* ── CÓMO FILTRAR ─────────────────────────────────────────────────── */}
        <section id="filtros" className="bg-muted/30 py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <SectionLabel>Sistema de Filtros</SectionLabel>
                <h2 className="text-3xl font-extrabold mb-5">Filtra por lo que importa</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  No todos los motoristas buscan lo mismo. Con nuestro sistema de filtros por topics,
                  puedes combinar múltiples criterios para ver exactamente lo que quieres.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-card rounded-lg border">
                    <MapPin className="w-5 h-5 text-moto-orange flex-shrink-0" />
                    <div>
                      <div className="text-sm font-semibold">Filtro por Ubicación</div>
                      <div className="text-xs text-muted-foreground">Filtra por ciudad o provincia: Madrid, Barcelona, Valencia, Sevilla...</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-card rounded-lg border">
                    <Filter className="w-5 h-5 text-moto-orange flex-shrink-0" />
                    <div>
                      <div className="text-sm font-semibold">Filtro por Tipo de Evento</div>
                      <div className="text-xs text-muted-foreground">Concentración, Ruta, Competición, Feria, Taller, Quedada, Benéfico...</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-card border rounded-2xl p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-moto-orange" /> Tipos de Eventos Disponibles
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Concentración', 'Ruta', 'Competición', 'Feria', 'Taller', 'Quedada', 'Benéfico', 'Otro'].map(t => (
                    <span key={t} className="px-2.5 py-1 bg-moto-orange/10 text-moto-orange text-xs font-semibold rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-moto-orange" /> Principales Ciudades
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Zaragoza', 'Málaga', 'Alicante', 'Granada', 'Murcia'].map(c => (
                      <span key={c} className="px-2 py-0.5 border text-xs rounded-full text-muted-foreground">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PARA MARCAS ──────────────────────────────────────────────────── */}
        <section id="marcas" className="max-w-6xl mx-auto px-6 py-16 md:py-20">
          <div className="text-center mb-12">
            <SectionLabel>Marcas y Patrocinadores</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
              Conecta con la comunidad motera española
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              MotoEvents es el punto de mayor concentración de motoristas activos de España.
              Un canal directo, segmentado y de alta intención de compra.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card border rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-moto-orange" /> Para Marcas del Sector Moto
              </h3>
              <div className="space-y-0">
                <BenefitRow icon={Eye} title="Visibilidad masiva en contexto" desc="Tu marca aparece cuando los motoristas están planificando sus próximas salidas y eventos. Máxima intención." />
                <BenefitRow icon={MapPin} title="Segmentación geográfica" desc="Dirige tus campañas a los motoristas de tu región o de toda España según tu estrategia de distribución." />
                <BenefitRow icon={Users} title="Audiencia verificada" desc="Usuarios reales, motoristas activos. Sin bots, sin audiencia casual. El engagement es el más alto del sector." />
                <BenefitRow icon={Star} title="Eventos patrocinados" desc="Destaca los eventos que patrocinas con badges especiales, posicionamiento preferente y mayor visibilidad." />
              </div>
            </div>
            <div className="bg-card border rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-moto-orange" /> Para Patrocinadores de Eventos
              </h3>
              <div className="space-y-0">
                <BenefitRow icon={Globe} title="Alcance nacional" desc="Un evento patrocinado en MotoEvents llega a toda la comunidad motera española, no solo al público local." />
                <BenefitRow icon={ShieldCheck} title="Credibilidad y confianza" desc="Asociar tu marca a una plataforma de referencia de la comunidad aumenta la percepción de calidad." />
                <BenefitRow icon={TrendingUp} title="ROI medible" desc="Estadísticas de visualizaciones, clicks e interacciones para medir el impacto real de tu patrocinio." />
                <BenefitRow icon={Zap} title="Time-to-market inmediato" desc="Tu patrocinio está visible en minutos. Sin lead times de semanas como en publicidad tradicional." />
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link href="/contacto" className="inline-flex items-center gap-2 px-6 py-3 bg-moto-orange text-white font-bold rounded-xl hover:bg-moto-orange-dark transition-colors">
              Hablar con el equipo de MotoEvents <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ── POR QUÉ UNIFICADO ────────────────────────────────────────────── */}
        <section id="comunidad" className="bg-gradient-to-br from-orange-950 to-orange-900 text-white py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                El argumento
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
                ¿Por qué unificar todos los eventos en un solo sitio?
              </h2>
              <p className="text-orange-200 max-w-2xl mx-auto">
                La fragmentación destruye comunidad. La unificación la construye.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: '🏍️',
                  title: 'Para los motoristas',
                  points: [
                    'No te perderás ningún evento cerca de ti',
                    'Planifica tus rutas y salidas con antelación',
                    'Descubre eventos de tipos que no conocías',
                    'Una sola app en lugar de 20 grupos de Facebook',
                  ],
                },
                {
                  icon: '📣',
                  title: 'Para los organizadores',
                  points: [
                    'Llega a toda la comunidad motera española',
                    'Publica en minutos con moderación de calidad',
                    'Más asistentes = eventos más vibrantes',
                    'Visibilidad gratuita para eventos locales',
                  ],
                },
                {
                  icon: '🤝',
                  title: 'Para la comunidad',
                  points: [
                    'Los eventos pequeños compiten en igualdad',
                    'Se preserva la cultura motera regional',
                    'Se fomente el encuentro y la hermandad',
                    'La comunidad crece cuando está conectada',
                  ],
                },
              ].map(col => (
                <div key={col.title} className="bg-white/10 rounded-2xl p-6">
                  <div className="text-3xl mb-3">{col.icon}</div>
                  <h3 className="font-bold text-lg mb-4">{col.title}</h3>
                  <ul className="space-y-2">
                    {col.points.map(p => (
                      <li key={p} className="flex items-start gap-2 text-sm text-orange-100">
                        <span className="text-moto-orange mt-0.5">✓</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ────────────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 py-16 md:py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            ¿Listo para no perderte ningún evento?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            El calendario es gratuito, sin registro y funciona desde el primer segundo.
            Coge el teléfono y empieza a explorar.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-moto-orange text-white font-bold text-lg rounded-xl hover:bg-moto-orange-dark transition-colors shadow-lg shadow-moto-orange/25">
            Abrir el Calendario <ChevronRight className="w-5 h-5" />
          </Link>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────────────── */}
        <Footer />
      </div>
    </>
  );
}
