import type { SterilizationType } from '@/modules/sterilization/types/sterilization.type';

export function validateNewLoad(instrumentIds: string[], type: SterilizationType, notes: string): string | null {
  if (!instrumentIds.length) return 'Selecciona al menos un instrumento.';
  if (!type) return 'Selecciona un tipo de esterilización.';
  if (!notes.trim()) return 'Agrega notas para identificar la carga.';
  return null;
}