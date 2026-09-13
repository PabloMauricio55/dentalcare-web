import type {
  Antecedents,
  CurrentAttention,
  ClinicalRecordSectionData,
  ClinicalRecordSections,
  Diagnoses,
  Evolution,
  Files,
  History,
  Odontogram,
  Preparation,
  PatientSummary,
} from '@/modules/clinical-records/types/clinical-record-session.type';

const mockPatients: Record<string, PatientSummary> = {
  'patient-001': {
    id: 'patient-001',
    fullName: 'Mariana López Hernández',
    birthDate: '1991-04-18',
    recordNumber: 'EXP-2026-001',
    allergies: ['Penicilina'],
  },
};

const defaultPatient: PatientSummary = {
  id: 'patient-demo',
  fullName: 'Paciente de demostración',
  birthDate: '1988-11-03',
  recordNumber: 'EXP-DEMO-001',
  allergies: [],
};

const defaultAttention: CurrentAttention = {
  reason: 'Evaluación odontológica de rutina',
  notes: 'Paciente refiere sensibilidad leve en el segundo molar superior derecho.',
  nextSteps: 'Realizar exploración clínica y actualizar el odontograma.',
};

export function getMockPatient(patientId: string): PatientSummary {
  return mockPatients[patientId] ?? { ...defaultPatient, id: patientId };
}

export function getMockCurrentAttention(): CurrentAttention {
  return { ...defaultAttention };
}

const defaultAntecedents: Antecedents = {
  allergies: 'Penicilina',
  systemicDiseases: 'Sin enfermedades sistémicas relevantes registradas.',
  currentMedication: 'Ninguna medicación actual registrada.',
  relevantHabits: 'No refiere tabaquismo.',
};

const defaultPreparation: Preparation = {
  consentSigned: false,
  instrumentsVerified: false,
  notes: 'Confirmar actualización de datos antes de la consulta.',
};

const defaultEvolution: Evolution = {
  note: 'Paciente tolera adecuadamente la atención simulada.',
  consultationDate: '2026-09-10',
  procedure: 'Evaluación odontológica inicial',
};

const defaultOdontogram: Odontogram = {
  dentition: 'adult',
  teeth: {},
};

const defaultDiagnoses: Diagnoses = {
  primary: 'Sensibilidad dental localizada',
  secondary: '',
  treatmentPlan: 'Revisión clínica y seguimiento preventivo.',
};

const defaultFiles: Files = {
  items: [],
};

const defaultHistory: History = {
  entries: [
    {
      id: 'history-001',
      action: 'Atención registrada',
      timestamp: '2026-09-10T09:30:00',
      author: 'Dra. Valeria Soto',
    },
    {
      id: 'history-002',
      action: 'Antecedentes actualizados',
      timestamp: '2026-09-11T14:15:00',
      author: 'Dr. Mateo Ruiz',
    },
  ],
};

export function getMockClinicalRecordSections(): ClinicalRecordSections {
  const data: ClinicalRecordSectionData = {
    attention: getMockCurrentAttention(),
    antecedentes: { ...defaultAntecedents },
    preparacion: { ...defaultPreparation },
    evolucion: { ...defaultEvolution },
    odontograma: { ...defaultOdontogram, teeth: { ...defaultOdontogram.teeth } },
    diagnosticos: { ...defaultDiagnoses },
    archivos: { ...defaultFiles, items: [...defaultFiles.items] },
    historial: { ...defaultHistory, entries: [...defaultHistory.entries] },
  };

  return {
    attention: { data: data.attention, validation: 'idle', feedback: null },
    antecedentes: { data: data.antecedentes, validation: 'idle', feedback: null },
    preparacion: { data: data.preparacion, validation: 'idle', feedback: null },
    evolucion: { data: data.evolucion, validation: 'idle', feedback: null },
    odontograma: { data: data.odontograma, validation: 'idle', feedback: null },
    diagnosticos: { data: data.diagnosticos, validation: 'idle', feedback: null },
    archivos: { data: data.archivos, validation: 'idle', feedback: null },
    historial: { data: data.historial, validation: 'idle', feedback: null },
  };
}