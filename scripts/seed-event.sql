-- ============================================
-- EVENTO DE PRUEBA - Concentración Motera Kando
-- Fecha: 3 de febrero de 2026
-- ============================================

-- Primero eliminamos el evento si ya existe para evitar duplicados
DELETE FROM events WHERE slug = 'concentracion-motera-kando-2026';

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
  'concentracion-motera-kando-2026',
  'Concentración Motera Kando',
  'La Concentración Motera Kando es uno de los eventos más esperados del año para los amantes de las motocicletas. Durante todo el día, podrás disfrutar de:

- Exhibición de motos clásicas y custom
- Conciertos en vivo con bandas locales
- Food trucks con gastronomía variada
- Zona de pruebas de motos nuevas
- Talleres de mecánica básica
- Sorteos y premios para los asistentes
- Área de camping para quienes quieran quedarse a dormir

Un evento familiar donde la pasión por las motos une a todos. ¡No te lo pierdas!',
  'Gran concentración motera con exhibición de motos, conciertos, food trucks y sorteos. Un día lleno de pasión sobre dos ruedas.',
  '2026-02-03',
  '2026-02-03',
  '10:00:00',
  '22:00:00',
  'Recinto Ferial de Kando',
  'Av. de los Moteros, 123, 28001',
  'Madrid',
  'España',
  40.4168,
  -3.7038,
  'Moto Club Kando',
  'info@motoclubkando.es',
  '+34 912 345 678',
  'https://motoclubkando.es',
  '@motoclubkando',
  'MotoClubKando',
  'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200&h=800&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800'
  ],
  'concentracion',
  ARRAY['todas', 'custom', 'trail'],
  ARRAY['concentracion', 'madrid', 'motos', 'evento', 'kando', '2026'],
  'Concentración Motera Kando 2026 | Madrid',
  'Gran concentración motera en Madrid con exhibición de motos, conciertos en vivo, food trucks y sorteos. ¡No te lo pierdas!',
  'approved',
  NULL,
  NULL,
  NOW(),
  0,
  0
);

-- Verificar que se insertó correctamente
SELECT * FROM events WHERE slug = 'concentracion-motera-kando-2026';
