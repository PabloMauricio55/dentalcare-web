import {
  validateCurrentAttention,
} from '@/modules/clinical-records/validation/current-attention.schema';
import type {
  Antecedents,
  ClinicalRecordSectionData,
  ClinicalRecordSectionKey,
  CurrentAttention,
  Diagnoses,
  Evolution,
  Files,
  History,
  Odontogram,
  Preparation,
} from '@/modules/clinical-records/types/clinical-record-session.type';

export type ClinicalRecordValidationResult = {
  valid: boolean;
  errorMessage: string;
  successMessage: string;
};

function validResult(successMessage: string): ClinicalRecordValidationResult {
  return { valid: true, errorMessage: '', successMessage };
}

export function validateAttentionSection(
  data: CurrentAttention,
): ClinicalRecordValidationResult {
  const errors = validateCurrentAttention(data);

  return {
    valid: Object.keys(errors).length === 0,
    errorMessage: 'Revisa los campos obligatorios antes de guardar.',
    successMessage: 'La atención actual se guardó correctamente (simulación).',
  };
}

export function validateAntecedents(
  data: Antecedents,
): ClinicalRecordValidationResult {
  void data;
  return validResult('Los antecedentes se guardaron correctamente (simulación).');
}

export function validatePreparation(
  data: Preparation,
): ClinicalRecordValidationResult {
  void data;
  return validResult('La preparación se guardó correctamente (simulación).');
}

export function validateEvolution(
  data: Evolution,
): ClinicalRecordValidationResult {
  void data;
  return validResult('La evolución se guardó correctamente (simulación).');
}

export function validateOdontogram(
  data: Odontogram,
): ClinicalRecordValidationResult {
  void data;
  return validResult('El odontograma se guardó correctamente (simulación).');
}

export function validateDiagnoses(
  data: Diagnoses,
): ClinicalRecordValidationResult {
  void data;
  return validResult('Los diagnósticos se guardaron correctamente (simulación).');
}

export function validateFiles(data: Files): ClinicalRecordValidationResult {
  void data;
  return validResult('Los archivos se guardaron correctamente (simulación).');
}

export function validateHistory(data: History): ClinicalRecordValidationResult {
  void data;
  return validResult('El historial se guardó correctamente (simulación).');
}

export const sectionValidators: {
  [Key in ClinicalRecordSectionKey]: (
    data: ClinicalRecordSectionData[Key],
  ) => ClinicalRecordValidationResult;
} = {
  attention: validateAttentionSection,
  antecedentes: validateAntecedents,
  preparacion: validatePreparation,
  evolucion: validateEvolution,
  odontograma: validateOdontogram,
  diagnosticos: validateDiagnoses,
  archivos: validateFiles,
  historial: validateHistory,
};