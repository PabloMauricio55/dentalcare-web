'use client';

import { createContext, useContext } from 'react';
import type {
  ClinicalRecordFeedback,
  ClinicalRecordSectionData,
  ClinicalRecordSectionKey,
  ClinicalRecordSections,
  CurrentAttention,
  PatientSummary,
} from '@/modules/clinical-records/types/clinical-record-session.type';

export type ClinicalRecordContextValue = {
  patient: PatientSummary;
  sections: ClinicalRecordSections;
  updateSection: <Key extends ClinicalRecordSectionKey>(
    key: Key,
    changes: Partial<ClinicalRecordSectionData[Key]>,
  ) => void;
  saveSection: <Key extends ClinicalRecordSectionKey>(key: Key) => void;
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