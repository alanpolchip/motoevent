/**
 * Genera un slug URL-amigable a partir de un texto
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .normalize('NFD')                    // Normaliza caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '')     // Elimina diacríticos
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')                // Espacios a guiones
    .replace(/[^\w\-]+/g, '')            // Elimina caracteres no alfanuméricos
    .replace(/\-\-+/g, '-');             // Múltiples guiones a uno solo
}

/**
 * Genera un slug único para evento con año y ciudad
 */
export function generateEventSlug(
  title: string, 
  city: string, 
  year: number,
  existingSlugs?: string[]
): string {
  const baseSlug = `${generateSlug(title)}-${generateSlug(city)}-${year}`;
  
  if (!existingSlugs || existingSlugs.length === 0) {
    return baseSlug;
  }
  
  // Si ya existe, añadir número al final
  let slug = baseSlug;
  let counter = 1;
  
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}
