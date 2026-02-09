-- ============================================
-- EVENTOS DE PRUEBA - MotoEvents Calendar
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- Limpiar eventos existentes (CUIDADO: solo para desarrollo)
-- DELETE FROM events;

-- ============================================
-- EVENTOS DE 1 DÍA
-- ============================================

-- Evento 1: Ruta por la Sierra (Hoy)
INSERT INTO events (
  slug, title, description, short_description, 
  start_date, location_name, location_city, location_country,
  organizer_name, featured_image, event_type, motorcycle_types, status
) VALUES (
  'ruta-sierra-guadarrama-' || to_char(CURRENT_DATE, 'YYYY-MM-DD'),
  'Ruta Sierra de Guadarrama',
  'Ruta de un día por las carreteras más bonitas de la Sierra de Guadarrama. Salida desde el Puerto de Navacerrada, pasando por el Valle de los Caídos y el Monasterio del Escorial. Nivel medio, apto para todo tipo de motos.',
  'Ruta de un día por la Sierra de Guadarrama. Nivel medio.',
  CURRENT_DATE,
  'Puerto de Navacerrada',
  'Madrid',
  'España',
  'Moto Club Sierra',
  'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200',
  'ruta',
  ARRAY['trail', 'naked', 'sport'],
  'approved'
);

-- Evento 2: Quedada motera (Mañana)
INSERT INTO events (
  slug, title, description, short_description,
  start_date, location_name, location_city, location_country,
  organizer_name, featured_image, event_type, motorcycle_types, status
) VALUES (
  'quedada-cafe-racer-' || to_char(CURRENT_DATE + 1, 'YYYY-MM-DD'),
  'Quedada Café Racer',
  'Encuentro informal de amantes de las café racer. Tomamos un café, charlamos de motos y hacemos una ruta corta por la zona. Todos los bikers son bienvenidos.',
  'Encuentro informal de café racers. Charla + ruta corta.',
  CURRENT_DATE + 1,
  'Café Central',
  'Valencia',
  'España',
  'Café Racer Club Valencia',
  'https://images.unsplash.com/photo-1558981852-426c6c22a060?w=1200',
  'quedada',
  ARRAY['custom', 'vintage'],
  'approved'
);

-- Evento 3: Taller mecánica (En 3 días)
INSERT INTO events (
  slug, title, description, short_description,
  start_date, location_name, location_city, location_country,
  organizer_name, featured_image, event_type, motorcycle_types, status
) VALUES (
  'taller-mecanica-basica-' || to_char(CURRENT_DATE + 3, 'YYYY-MM-DD'),
  'Taller Mecánica Básica',
  'Aprende a realizar el mantenimiento básico de tu moto: cambio de aceite, ajuste de cadena, revisión de frenos. Taller práctico de 4 horas con mecánico profesional.',
  'Taller práctico de mecánica básica (4h).',
  CURRENT_DATE + 3,
  'Taller MotoPro',
  'Barcelona',
  'España',
  'Escuela de Mecánica BCN',
  'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200',
  'taller',
  ARRAY['todas'],
  'approved'
);

-- Evento 4: Concentración Custom (En 5 días)
INSERT INTO events (
  slug, title, description, short_description,
  start_date, location_name, location_city, location_country,
  organizer_name, featured_image, event_type, motorcycle_types, status
) VALUES (
  'custom-bikes-show-' || to_char(CURRENT_DATE + 5, 'YYYY-MM-DD'),
  'Custom Bikes Show',
  'Exhibición de motos custom y choppers. Concurso de customización, música en vivo, food trucks y sorteos. Entrada gratuita.',
  'Exhibición de custom y choppers con música en vivo.',
  CURRENT_DATE + 5,
  'Recinto Ferial',
  'Sevilla',
  'España',
  'Custom Riders Sevilla',
  'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200',
  'concentracion',
  ARRAY['custom'],
  'approved'
);

-- ============================================
-- EVENTOS MULTI-DÍA
-- ============================================

-- Evento 5: Concentración Pingüinos (Próximo fin de semana - 3 días)
INSERT INTO events (
  slug, title, description, short_description,
  start_date, end_date, location_name, location_city, location_country,
  organizer_name, featured_image, event_type, motorcycle_types, status
) VALUES (
  'pinguinos-' || to_char(CURRENT_DATE + 6, 'YYYY'),
  'Concentración Pingüinos 2026',
  'La concentración motera más grande de España. Tres días de música, rutas, actividades y mucha diversión. Más de 30.000 motos esperadas. Camping incluido.',
  'La concentración motera más grande de España. 30.000+ motos.',
  CURRENT_DATE + 6,
  CURRENT_DATE + 8,
  'Recinto Ferial de Valladolid',
  'Valladolid',
  'España',
  'Pingüinos Moto Club',
  'https://images.unsplash.com/photo-1591361387037-0d609c30dd9f?w=1200',
  'concentracion',
  ARRAY['todas'],
  'approved'
);

-- Evento 6: Ruta Costa Mediterránea (2 días - en 10 días)
INSERT INTO events (
  slug, title, description, short_description,
  start_date, end_date, location_name, location_city, location_country,
  organizer_name, featured_image, event_type, motorcycle_types, status
) VALUES (
  'ruta-costa-mediterranea-' || to_char(CURRENT_DATE + 10, 'YYYY-MM-DD'),
  'Ruta Costa Mediterránea',
  'Ruta de dos días por la costa mediterránea. Salida desde Valencia, pasando por Alicante y llegada a Murcia. Pernoctamos en Alicante. Nivel medio-alto.',
  'Ruta 2 días por costa mediterránea. Valencia-Murcia.',
  CURRENT_DATE + 10,
  CURRENT_DATE + 11,
  'Puerto de Valencia',
  'Valencia',
  'España',
  'Riders del Mediterráneo',
  'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=1200',
  'ruta',
  ARRAY['trail', 'sport', 'naked'],
  'approved'
);

-- Evento 7: Festival MotoRock (4 días - en 2 semanas)
INSERT INTO events (
  slug, title, description, short_description,
  start_date, end_date, location_name, location_city, location_country,
  organizer_name, featured_image, event_type, motorcycle_types, status
) VALUES (
  'motorock-festival-' || to_char(CURRENT_DATE + 14, 'YYYY'),
  'Festival MotoRock 2026',
  'Cuatro días de rock, motos y diversión. Conciertos en vivo, exhibiciones de freestyle, zona de tatoos, camping y mucho más. Lineup: AC/DC Tribute, Iron Maiden Cover, y bandas locales.',
  'Festival de rock y motos. 4 días de música y freestyle.',
  CURRENT_DATE + 14,
  CURRENT_DATE + 17,
  'Parque de Atracciones',
  'Zaragoza',
  'España',
  'MotoRock Org',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
  'concentracion',
  ARRAY['todas'],
  'approved'
);

-- Evento 8: Evento benéfico (1 día - en 20 días)
INSERT INTO events (
  slug, title, description, short_description,
  start_date, location_name, location_city, location_country,
  organizer_name, featured_image, event_type, motorcycle_types, status
) VALUES (
  'ruta-solidaria-cancer-' || to_char(CURRENT_DATE + 20, 'YYYY-MM-DD'),
  'Ruta Solidaria contra el Cáncer',
  'Ruta benéfica para recaudar fondos para la investigación del cáncer infantil. Salida masiva desde Madrid, llegada a Toledo. Inscripción: 20€ (donativo). Medallas para todos los participantes.',
  'Ruta benéfica para investigación contra cáncer infantil.',
  CURRENT_DATE + 20,
  'Puerta de Alcalá',
  'Madrid',
  'España',
  'Guardianes Moto Club',
  'https://images.unsplash.com/photo-1558980664-769d59546b3d?w=1200',
  'benefico',
  ARRAY['todas'],
  'approved'
);

-- Evento 9: Competición enduro (En 25 días)
INSERT INTO events (
  slug, title, description, short_description,
  start_date, location_name, location_city, location_country,
  organizer_name, featured_image, event_type, motorcycle_types, status
) VALUES (
  'enduro-cross-country-' || to_char(CURRENT_DATE + 25, 'YYYY-MM-DD'),
  'Enduro Cross Country',
  'Competición de enduro nivel amateur y profesional. Recorrido de 80km con tramos técnicos, cruces de ríos y saltos. Categorías: novatos, amateur, pro.',
  'Competición enduro 80km. Categorías: novatos, amateur, pro.',
  CURRENT_DATE + 25,
  'Circuito Off-Road',
  'Teruel',
  'España',
  'Federación Aragonesa de Motociclismo',
  'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200',
  'competicion',
  ARRAY['trail'],
  'approved'
);

-- Evento 10: Feria de motos clásicas (2 días - en 30 días)
INSERT INTO events (
  slug, title, description, short_description,
  start_date, end_date, location_name, location_city, location_country,
  organizer_name, featured_image, event_type, motorcycle_types, status
) VALUES (
  'classic-motorcycle-show-' || to_char(CURRENT_DATE + 30, 'YYYY'),
  'Classic Motorcycle Show',
  'Feria de motos clásicas y vintage. Exposición de modelos históricos, compra-venta de recambios, restauradores profesionales. Conferencias sobre historia del motociclismo.',
  'Feria de motos clásicas con exposición y compra-venta.',
  CURRENT_DATE + 30,
  CURRENT_DATE + 31,
  'Palacio de Congresos',
  'Bilbao',
  'España',
  'Classic Bikers Euskadi',
  'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200',
  'feria',
  ARRAY['vintage'],
  'approved'
);

-- ============================================
-- EVENTOS PENDIENTES DE MODERACIÓN
-- ============================================

INSERT INTO events (
  slug, title, description, short_description,
  start_date, location_name, location_city, location_country,
  organizer_name, featured_image, event_type, motorcycle_types, status
) VALUES (
  'ruta-sierra-nevada-pending',
  'Ruta Sierra Nevada',
  'Ruta por Sierra Nevada con parada para comer en un cortijo típico.',
  'Ruta Sierra Nevada con comida típica.',
  CURRENT_DATE + 35,
  'Granada',
  'Granada',
  'España',
  'Riders Granada',
  'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200',
  'ruta',
  ARRAY['todas'],
  'pending'
);

-- ============================================
-- RESUMEN
-- ============================================
-- Total eventos insertados: 11
-- - Aprobados: 10
-- - Pendientes: 1
-- - Eventos de 1 día: 7
-- - Eventos multi-día: 4
-- ============================================

SELECT 
  status,
  COUNT(*) as total
FROM events 
GROUP BY status;
