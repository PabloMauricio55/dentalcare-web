export type PatientSummary = {
  id: string;
  fullName: string;
  birthDate: string;
  recordNumber: string;
  allergies: string[];
};

export type CurrentAttention = {
  reason: string;
  notes: string;
  nextSteps: string;
};

export type ClinicalRecordFeedback = {
  type: 'success' | 'error';
  message: string;
};