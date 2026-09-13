'use client';

import { createContext, useContext } from 'react';
import type {
  ClinicalRecordFeedback,
  CurrentAttention,
  PatientSummary,
} from '@/modules/clinical-records/types/clinical-record-session.type';

export type ClinicalRecordContextValue = {
  patient: PatientSummary;
  attention: CurrentAttention;
  feedback: ClinicalRecordFeedback | null;
  updateAttention: (changes: Partial<CurrentAttention>) => void;
  saveAttention: () => void;
};

export const ClinicalRecordContext = createContext<
  ClinicalRecordContextValue | undefined
>(undefined);

export function useClinicalRecord(): ClinicalRecordContextValue {
  const context = useContext(ClinicalRecordContext);

  if (!context) {
    throw new Error('useClinicalRecord debe usarse dentro de ClinicalRecordProvider.');
  }

  return context;
}