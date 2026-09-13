'use client';

import { useState, type ReactNode } from 'react';
import { ClinicalRecordContext } from '@/modules/clinical-records/hooks/useClinicalRecord';
import {
  getMockCurrentAttention,
  getMockPatient,
} from '@/modules/clinical-records/services/clinical-record.service';
import type {
  ClinicalRecordFeedback,
  CurrentAttention,
} from '@/modules/clinical-records/types/clinical-record-session.type';
import { validateCurrentAttention } from '@/modules/clinical-records/validation/current-attention.schema';

type ClinicalRecordProviderProps = {
  patientId: string;
  children: ReactNode;
};

export function ClinicalRecordProvider({
  patientId,
  children,
}: ClinicalRecordProviderProps) {
  const [attention, setAttention] = useState<CurrentAttention>(
    getMockCurrentAttention,
  );
  const [feedback, setFeedback] = useState<ClinicalRecordFeedback | null>(null);
  const patient = getMockPatient(patientId);

  function updateAttention(changes: Partial<CurrentAttention>) {
    setAttention((currentAttention) => ({ ...currentAttention, ...changes }));
    setFeedback(null);
  }

  function saveAttention() {
    const errors = validateCurrentAttention(attention);

    if (Object.keys(errors).length > 0) {
      setFeedback({
        type: 'error',
        message: 'Revisa los campos obligatorios antes de guardar.',
      });
      return;
    }

    setFeedback({
      type: 'success',
      message: 'La atención actual se guardó correctamente (simulación).',
    });
  }

  return (
    <ClinicalRecordContext.Provider
      value={{ patient, attention, feedback, updateAttention, saveAttention }}
    >
      {children}
    </ClinicalRecordContext.Provider>
  );
}