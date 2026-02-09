#!/usr/bin/env node

/**
 * Script para poblar la base de datos con eventos de prueba
 * Uso: node scripts/populate-events.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Función para generar fecha en formato YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Obtener fecha actual
const today = new Date();

const testEvents = [
  // Evento 1: Ruta hoy
  {
    slug: `ruta-sierra-guadarrama-${formatDate(today)}`,
    title: 'Ruta Sierra de Guadarrama',
    description: 'Ruta de un día por las carreteras más bonitas de la Sierra de Guadarrama. Salida desde el Puerto de Navacerrada, pasando por el Valle de los Caídos y el Monasterio del Escorial. Nivel medio, apto para todo tipo de motos.',
    short_description: 'Ruta de un día por la Sierra de Guadarrama. Nivel medio.',
    start_date: formatDate(today),
    location_name: 'Puerto de Navacerrada',
    location_city: 'Madrid',
    location_country: 'España',
    organizer_name: 'Moto Club Sierra',
    featured_image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200',
    event_type: 'ruta',
    motorcycle_types: ['trail', 'naked', 'sport'],
    status: 'approved'
  },
  
  // Evento 2: Quedada mañana
  {
    slug: `quedada-cafe-racer-${formatDate(new Date(today.getTime() + 86400000))}`,
    title: 'Quedada Café Racer',
    description: 'Encuentro informal de amantes de las café racer. Tomamos un café, charlamos de motos y hacemos una ruta corta por la zona. Todos los bikers son bienvenidos.',
    short_description: 'Encuentro informal de café racers. Charla + ruta corta.',
    start_date: formatDate(new Date(today.getTime() + 86400000)),
    location_name: 'Café Central',
    location_city: 'Valencia',
    location_country: 'España',
    organizer_name: 'Café Racer Club Valencia',
    featured_image: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?w=1200',
    event_type: 'quedada',
    motorcycle_types: ['custom', 'vintage'],
    status: 'approved'
  },
  
  // Evento 3: Taller en 3 días
  {
    slug: `taller-mecanica-basica-${formatDate(new Date(today.getTime() + 259200000))}`,
    title: 'Taller Mecánica Básica',
    description: 'Aprende a realizar el mantenimiento básico de tu moto: cambio de aceite, ajuste de cadena, revisión de frenos. Taller práctico de 4 horas con mecánico profesional.',
    short_description: 'Taller práctico de mecánica básica (4h).',
    start_date: formatDate(new Date(today.getTime() + 259200000)),
    location_name: 'Taller MotoPro',
    location_city: 'Barcelona',
    location_country: 'España',
    organizer_name: 'Escuela de Mecánica BCN',
    featured_image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200',
    event_type: 'taller',
    motorcycle_types: ['todas'],
    status: 'approved'
  },
  
  // Evento 4: Custom Show en 5 días
  {
    slug: `custom-bikes-show-${formatDate(new Date(today.getTime() + 432000000))}`,
    title: 'Custom Bikes Show',
    description: 'Exhibición de motos custom y choppers. Concurso de customización, música en vivo, food trucks y sorteos. Entrada gratuita.',
    short_description: 'Exhibición de custom y choppers con música en vivo.',
    start_date: formatDate(new Date(today.getTime() + 432000000)),
    location_name: 'Recinto Ferial',
    location_city: 'Sevilla',
    location_country: 'España',
    organizer_name: 'Custom Riders Sevilla',
    featured_image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200',
    event_type: 'concentracion',
    motorcycle_types: ['custom'],
    status: 'approved'
  },
  
  // Evento 5: Pingüinos multi-día (3 días)
  {
    slug: `pinguinos-${new Date(today.getTime() + 518400000).getFullYear()}`,
    title: 'Concentración Pingüinos 2026',
    description: 'La concentración motera más grande de España. Tres días de música, rutas, actividades y mucha diversión. Más de 30.000 motos esperadas. Camping incluido.',
    short_description: 'La concentración motera más grande de España. 30.000+ motos.',
    start_date: formatDate(new Date(today.getTime() + 518400000)),
    end_date: formatDate(new Date(today.getTime() + 691200000)),
    location_name: 'Recinto Ferial de Valladolid',
    location_city: 'Valladolid',
    location_country: 'España',
    organizer_name: 'Pingüinos Moto Club',
    featured_image: 'https://images.unsplash.com/photo-1591361387037-0d609c30dd9f?w=1200',
    event_type: 'concentracion',
    motorcycle_types: ['todas'],
    status: 'approved'
  },
  
  // Evento 6: Ruta Costa (2 días)
  {
    slug: `ruta-costa-mediterranea-${formatDate(new Date(today.getTime() + 864000000))}`,
    title: 'Ruta Costa Mediterránea',
    description: 'Ruta de dos días por la costa mediterránea. Salida desde Valencia, pasando por Alicante y llegada a Murcia. Pernoctamos en Alicante. Nivel medio-alto.',
    short_description: 'Ruta 2 días por costa mediterránea. Valencia-Murcia.',
    start_date: formatDate(new Date(today.getTime() + 864000000)),
    end_date: formatDate(new Date(today.getTime() + 950400000)),
    location_name: 'Puerto de Valencia',
    location_city: 'Valencia',
    location_country: 'España',
    organizer_name: 'Riders del Mediterráneo',
    featured_image: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=1200',
    event_type: 'ruta',
    motorcycle_types: ['trail', 'sport', 'naked'],
    status: 'approved'
  },
  
  // Evento 7: MotoRock (4 días)
  {
    slug: `motorock-festival-${new Date(today.getTime() + 1209600000).getFullYear()}`,
    title: 'Festival MotoRock 2026',
    description: 'Cuatro días de rock, motos y diversión. Conciertos en vivo, exhibiciones de freestyle, zona de tatoos, camping y mucho más.',
    short_description: 'Festival de rock y motos. 4 días de música y freestyle.',
    start_date: formatDate(new Date(today.getTime() + 1209600000)),
    end_date: formatDate(new Date(today.getTime() + 1468800000)),
    location_name: 'Parque de Atracciones',
    location_city: 'Zaragoza',
    location_country: 'España',
    organizer_name: 'MotoRock Org',
    featured_image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
    event_type: 'concentracion',
    motorcycle_types: ['todas'],
    status: 'approved'
  },
  
  // Evento 8: Ruta solidaria
  {
    slug: `ruta-solidaria-cancer-${formatDate(new Date(today.getTime() + 1728000000))}`,
    title: 'Ruta Solidaria contra el Cáncer',
    description: 'Ruta benéfica para recaudar fondos para la investigación del cáncer infantil. Salida masiva desde Madrid, llegada a Toledo. Inscripción: 20€ (donativo).',
    short_description: 'Ruta benéfica para investigación contra cáncer infantil.',
    start_date: formatDate(new Date(today.getTime() + 1728000000)),
    location_name: 'Puerta de Alcalá',
    location_city: 'Madrid',
    location_country: 'España',
    organizer_name: 'Guardianes Moto Club',
    featured_image: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?w=1200',
    event_type: 'benefico',
    motorcycle_types: ['todas'],
    status: 'approved'
  },
  
  // Evento 9: Enduro
  {
    slug: `enduro-cross-country-${formatDate(new Date(today.getTime() + 2160000000))}`,
    title: 'Enduro Cross Country',
    description: 'Competición de enduro nivel amateur y profesional. Recorrido de 80km con tramos técnicos, cruces de ríos y saltos.',
    short_description: 'Competición enduro 80km. Categorías: novatos, amateur, pro.',
    start_date: formatDate(new Date(today.getTime() + 2160000000)),
    location_name: 'Circuito Off-Road',
    location_city: 'Teruel',
    location_country: 'España',
    organizer_name: 'Federación Aragonesa de Motociclismo',
    featured_image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200',
    event_type: 'competicion',
    motorcycle_types: ['trail'],
    status: 'approved'
  },
  
  // Evento 10: Classic Show (2 días)
  {
    slug: `classic-motorcycle-show-${new Date(today.getTime() + 2592000000).getFullYear()}`,
    title: 'Classic Motorcycle Show',
    description: 'Feria de motos clásicas y vintage. Exposición de modelos históricos, compra-venta de recambios, restauradores profesionales.',
    short_description: 'Feria de motos clásicas con exposición y compra-venta.',
    start_date: formatDate(new Date(today.getTime() + 2592000000)),
    end_date: formatDate(new Date(today.getTime() + 2678400000)),
    location_name: 'Palacio de Congresos',
    location_city: 'Bilbao',
    location_country: 'España',
    organizer_name: 'Classic Bikers Euskadi',
    featured_image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200',
    event_type: 'feria',
    motorcycle_types: ['vintage'],
    status: 'approved'
  },
  
  // Evento pendiente de moderación
  {
    slug: 'ruta-sierra-nevada-pending',
    title: 'Ruta Sierra Nevada',
    description: 'Ruta por Sierra Nevada con parada para comer en un cortijo típico.',
    short_description: 'Ruta Sierra Nevada con comida típica.',
    start_date: formatDate(new Date(today.getTime() + 3024000000)),
    location_name: 'Granada',
    location_city: 'Granada',
    location_country: 'España',
    organizer_name: 'Riders Granada',
    featured_image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200',
    event_type: 'ruta',
    motorcycle_types: ['todas'],
    status: 'pending'
  }
];

async function populateEvents() {
  console.log('🏍️  Poblando base de datos con eventos de prueba...\n');
  
  try {
    // Insertar eventos
    const { data, error } = await supabase
      .from('events')
      .insert(testEvents)
      .select();
    
    if (error) {
      console.error('❌ Error al insertar eventos:', error.message);
      process.exit(1);
    }
    
    console.log(`✅ ${data.length} eventos insertados correctamente\n`);
    
    // Mostrar resumen
    const approved = data.filter(e => e.status === 'approved').length;
    const pending = data.filter(e => e.status === 'pending').length;
    
    console.log('📊 Resumen:');
    console.log(`   • Eventos aprobados: ${approved}`);
    console.log(`   • Eventos pendientes: ${pending}`);
    console.log(`   • Total: ${data.length}\n`);
    
    console.log('🎉 ¡Listo! Recarga el calendario para ver los eventos.');
    
  } catch (error) {
    console.error('❌ Error inesperado:', error);
    process.exit(1);
  }
}

populateEvents();
