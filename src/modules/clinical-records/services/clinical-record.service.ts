import type {
  CurrentAttention,
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