'use client';

import { useState, type ReactNode } from 'react';
import { ClinicalRecordContext } from '@/modules/clinical-records/hooks/useClinicalRecord';
import {
  getMockClinicalRecordSections,
  getMockPatient,
} from '@/modules/clinical-records/services/clinical-record.service';
import type {
  ClinicalRecordFeedback,
  ClinicalRecordSectionData,
  ClinicalRecordSectionKey,
  ClinicalRecordSections,
  CurrentAttention,
} from '@/modules/clinical-records/types/clinical-record-session.type';
import {
  sectionValidators,
} from '@/modules/clinical-records/validation/clinical-record-section.validation';

type ClinicalRecordProviderProps = {
  patientId: string;
  children: ReactNode;
};

export function ClinicalRecordProvider({
  patientId,
  children,
}: ClinicalRecordProviderProps) {
  const [sections, setSections] = useState<ClinicalRecordSections>(
    getMockClinicalRecordSections,
  );
  const patient = getMockPatient(patientId);

  function updateSection<Key extends ClinicalRecordSectionKey>(
    key: Key,
    changes: Partial<ClinicalRecordSectionData[Key]>,
  ) {
    setSections((currentSections) => ({
      ...currentSections,
      [key]: {
        ...currentSections[key],
        data: { ...currentSections[key].data, ...changes },
        validation: 'idle',
        feedback: null,
      },
    }));
  }

  function saveSection<Key extends ClinicalRecordSectionKey>(key: Key) {
    setSections((currentSections) => {
      const section = currentSections[key];
      const result = sectionValidators[key](section.data);

      if (!result.valid) {
        return {
          ...currentSections,
          [key]: {
            ...section,
            validation: 'error',
            feedback: {
              type: 'error',
              message: result.errorMessage,
            },
          },
        };
      }

      return {
        ...currentSections,
        [key]: {
          ...section,
          validation: 'valid',
          feedback: {
            type: 'success',
            message: result.successMessage,
          },
        },
      };
    });
  }

  function updateAttention(changes: Partial<CurrentAttention>) {
    updateSection('attention', changes);
  }

  function saveAttention() {
    saveSection('attention');
  }

  const attention = sections.attention.data;
  const feedback: ClinicalRecordFeedback | null = sections.attention.feedback;

  return (
    <ClinicalRecordContext.Provider
      value={{
        patient,
        sections,
        updateSection,
        saveSection,
        attention,
        feedback,
        updateAttention,
        saveAttention,
      }}
    >
      {children}
    </ClinicalRecordContext.Provider>
  );
}