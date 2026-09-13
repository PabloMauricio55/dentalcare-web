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
  medical: 'Sin antecedentes médicos relevantes registrados.',
  dental: 'Limpieza dental hace seis meses.',
  family: 'Sin antecedentes familiares registrados.',
};

const defaultPreparation: Preparation = {
  instructions: 'Confirmar actualización de datos antes de la consulta.',
  status: 'pending',
};

const defaultEvolution: Evolution = {
  summary: 'Sin evoluciones adicionales en esta sesión.',
  nextAppointment: 'Por definir',
};

const defaultOdontogram: Odontogram = {
  dentition: 'adult',
  teeth: {},
};

const defaultDiagnoses: Diagnoses = {
  items: [],
};

const defaultFiles: Files = {
  items: [],
};

const defaultHistory: History = {
  entries: [],
};

export function getMockClinicalRecordSections(): ClinicalRecordSections {
  const data: ClinicalRecordSectionData = {
    attention: getMockCurrentAttention(),
    antecedentes: { ...defaultAntecedents },
    preparacion: { ...defaultPreparation },
    evolucion: { ...defaultEvolution },
    odontograma: { ...defaultOdontogram, teeth: { ...defaultOdontogram.teeth } },
    diagnosticos: { ...defaultDiagnoses, items: [...defaultDiagnoses.items] },
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