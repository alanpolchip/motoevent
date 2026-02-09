-- ============================================
-- SCRIPT PARA INSERTAR EVENTOS DE PRUEBA
-- Ejecutar en SQL Editor de Supabase
-- ============================================

-- Eliminar eventos de prueba existentes si los hay
DELETE FROM events WHERE slug LIKE 'test-%' OR slug IN (
  'concentracion-motera-barcelona-2026',
  'ruta-sierra-madrid-2026',
  'feria-motor-valencia-2026',
  'concentracion-kando-2026',
  'evento-prueba-sevilla-2026'
);

-- ============================================
-- EVENTO 1: Concentración Motera Barcelona (Pendiente)
-- ============================================
INSERT INTO events (
  slug,
  title,
  description,
  short_description,
  start_date,
  end_date,
  start_time,
  end_time,
  location_name,
  location_address,
  location_city,
  location_country,
  latitude,
  longitude,
  organizer_name,
  organizer_email,
  organizer_phone,
  organizer_website,
  organizer_instagram,
  organizer_facebook,
  featured_image,
  gallery_images,
  event_type,
  motorcycle_types,
  tags,
  meta_title,
  meta_description,
  status,
  submitted_by,
  moderated_by,
  moderated_at,
  view_count,
  added_to_calendar_count
) VALUES (
  'concentracion-motera-barcelona-2026',
  'Concentración Motera Barcelona',
  'La Concentración Motera Barcelona es uno de los eventos más esperados del año. Durante todo el día, podrás disfrutar de:

- Exhibición de motos clásicas y custom
- Conciertos en vivo con bandas locales
- Food trucks con gastronomía variada
- Zona de pruebas de motos nuevas
- Talleres de mecánica básica
- Sorteos y premios para los asistentes

Un evento familiar donde la pasión por las motos une a todos.',
  'Gran concentración motera con exhibición de motos, conciertos, food trucks y sorteos.',
  '2026-03-15',
  '2026-03-15',
  '10:00:00',
  '22:00:00',
  'Plaza de España',
  'Plaza de España, 08015',
  'Barcelona',
  'España',
  41.3851,
  2.1734,
  'Moto Club Barcelona',
  'info@motoclubbarcelona.es',
  '+34 934 567 890',
  'https://motoclubbarcelona.es',
  '@motoclubbarcelona',
  'MotoClubBarcelona',
  'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&h=800&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800'
  ],
  'concentracion',
  ARRAY['todas', 'custom', 'sport'],
  ARRAY['concentracion', 'barcelona', 'motos', 'evento', '2026'],
  'Concentración Motera Barcelona 2026',
  'Gran concentración motera en Barcelona con exhibición de motos, conciertos en vivo, food trucks y sorteos.',
  'pending',
  NULL,
  NULL,
  NULL,
  0,
  0
);

-- ============================================
-- EVENTO 2: Ruta por la Sierra (Pendiente)
-- ============================================
INSERT INTO events (
  slug,
  title,
  description,
  short_description,
  start_date,
  end_date,
  start_time,
  end_time,
  location_name,
  location_address,
  location_city,
  location_country,
  latitude,
  longitude,
  organizer_name,
  organizer_email,
  organizer_phone,
  featured_image,
  event_type,
  motorcycle_types,
  tags,
  status,
  submitted_by,
  view_count,
  added_to_calendar_count
) VALUES (
  'ruta-sierra-madrid-2026',
  'Ruta por la Sierra',
  'Únete a nosotros para una ruta espectacular por la Sierra de Madrid. Recorreremos carreteras sinuosas con vistas increíbles.

- Punto de encuentro: Gasolinera Repsol
- Ruta de aproximadamente 150km
- Parada para comer en restaurante típico
- Grupos por niveles
- Mecánico de apoyo',
  'Ruta motera por la Sierra de Madrid con parada para comer y grupos por niveles.',
  '2026-04-02',
  '2026-04-02',
  '09:00:00',
  '17:00:00',
  'Gasolinera Repsol',
  'Carretera de la Sierra, Km 12',
  'Madrid',
  'España',
  40.4168,
  -3.7038,
  'Rutas Moto Madrid',
  'info@rutasmotomadrid.es',
  '+34 912 345 678',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop',
  'ruta',
  ARRAY['todas', 'trail', 'naked'],
  ARRAY['ruta', 'madrid', 'sierra', 'motos'],
  'pending',
  NULL,
  0,
  0
);

-- ============================================
-- EVENTO 3: Feria del Motor Valencia (Por Modificar)
-- ============================================
INSERT INTO events (
  slug,
  title,
  description,
  short_description,
  start_date,
  end_date,
  start_time,
  end_time,
  location_name,
  location_address,
  location_city,
  location_country,
  latitude,
  longitude,
  organizer_name,
  organizer_email,
  featured_image,
  event_type,
  motorcycle_types,
  tags,
  status,
  submitted_by,
  view_count,
  added_to_calendar_count
) VALUES (
  'feria-motor-valencia-2026',
  'Feria del Motor Valencia',
  'La Feria del Motor de Valencia reúne a los principales fabricantes y accesoristas del sector.

- Exposición de novedades 2026
- Zona de pruebas
- Conferencias y charlas
- Área de restauración
- Mercadillo de piezas',
  'Feria del motor con exposición de novedades, zona de pruebas y mercadillo.',
  '2026-05-10',
  '2026-05-11',
  '10:00:00',
  '20:00:00',
  'Feria Valencia',
  'Av. de las Ferias, s/n',
  'Valencia',
  'España',
  39.4699,
  -0.3763,
  'Ferias Valencia',
  'info@feriasvalencia.com',
  'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200&h=800&fit=crop',
  'feria',
  ARRAY['todas'],
  ARRAY['feria', 'valencia', 'motor', 'exposicion'],
  'pending',
  NULL,
  0,
  0
);

-- ============================================
-- EVENTO 4: Concentración Kando (Aprobado)
-- ============================================
INSERT INTO events (
  slug,
  title,
  description,
  short_description,
  start_date,
  end_date,
  start_time,
  end_time,
  location_name,
  location_address,
  location_city,
  location_country,
  latitude,
  longitude,
  organizer_name,
  organizer_email,
  organizer_phone,
  featured_image,
  event_type,
  motorcycle_types,
  tags,
  status,
  submitted_by,
  moderated_at,
  view_count,
  added_to_calendar_count
) VALUES (
  'concentracion-kando-2026',
  'Concentración Motera Kando',
  'La Concentración Motera Kando es uno de los eventos más esperados del año para los amantes de las motocicletas.

- Exhibición de motos clásicas y custom
- Conciertos en vivo
- Food trucks
- Zona de pruebas
- Sorteos y premios',
  'Gran concentración motera con exhibición de motos, conciertos y sorteos.',
  '2026-02-03',
  '2026-02-03',
  '10:00:00',
  '22:00:00',
  'Recinto Ferial de Kando',
  'Av. de los Moteros, 123',
  'Madrid',
  'España',
  40.4168,
  -3.7038,
  'Moto Club Kando',
  'info@motoclubkando.es',
  '+34 912 345 678',
  'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&h=800&fit=crop',
  'concentracion',
  ARRAY['todas', 'custom'],
  ARRAY['concentracion', 'madrid', 'kando', 'motos'],
  'approved',
  NULL,
  NOW(),
  0,
  0
);

-- ============================================
-- EVENTO 5: Evento de Prueba (Rechazado)
-- ============================================
INSERT INTO events (
  slug,
  title,
  description,
  short_description,
  start_date,
  end_date,
  start_time,
  end_time,
  location_name,
  location_city,
  location_country,
  organizer_name,
  organizer_email,
  featured_image,
  event_type,
  status,
  rejection_reason,
  submitted_by,
  moderated_at,
  view_count,
  added_to_calendar_count
) VALUES (
  'evento-prueba-sevilla-2026',
  'Evento de Prueba',
  'Este es un evento de prueba que fue rechazado por falta de información.',
  'Evento de prueba rechazado.',
  '2026-02-01',
  '2026-02-01',
  '10:00:00',
  '14:00:00',
  'Plaza de España',
  'Sevilla',
  'España',
  'Test User',
  'test@example.com',
  'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200&h=800&fit=crop',
  'otro',
  'rejected',
  'Información incompleta: falta descripción detallada y datos de contacto del organizador.',
  NULL,
  NOW(),
  0,
  0
);

-- Verificar eventos insertados
SELECT id, title, status, location_city, start_date 
FROM events 
WHERE slug IN (
  'concentracion-motera-barcelona-2026',
  'ruta-sierra-madrid-2026',
  'feria-motor-valencia-2026',
  'concentracion-kando-2026',
  'evento-prueba-sevilla-2026'
)
ORDER BY start_date;