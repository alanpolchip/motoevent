import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge de clases de Tailwind CSS con soporte para condicionales
 * Combina clsx (clases condicionales) + tailwind-merge (resolución de conflictos)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
