import type { CurrentAttention } from '@/modules/clinical-records/types/clinical-record-session.type';

export type CurrentAttentionErrors = Partial<Record<keyof CurrentAttention, string>>;

export function validateCurrentAttention(
  attention: CurrentAttention,
): CurrentAttentionErrors {
  const errors: CurrentAttentionErrors = {};

  if (!attention.reason.trim()) {
    errors.reason = 'Indica el motivo de la atención.';
  }

  if (!attention.notes.trim()) {
    errors.notes = 'Registra las notas de la atención.';
  }

  return errors;
}