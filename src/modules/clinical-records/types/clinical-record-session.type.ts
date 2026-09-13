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

export type ClinicalRecordValidation = 'idle' | 'valid' | 'error';

export type Antecedents = {
  allergies: string;
  systemicDiseases: string;
  currentMedication: string;
  relevantHabits: string;
};

export type Preparation = {
  consentSigned: boolean;
  instrumentsVerified: boolean;
  notes: string;
};

export type Evolution = {
  note: string;
  consultationDate: string;
  procedure: string;
};

export type ToothStatus = 'healthy' | 'carious' | 'missing' | 'treated' | 'to-treat';

export type DentitionType = 'adult' | 'mixed' | 'child';

export type Odontogram = {
  dentition: DentitionType;
  teethByDentition: Record<DentitionType, Record<string, ToothStatus>>;
};

export type Diagnoses = {
  primary: string;
  secondary: string;
  treatmentPlan: string;
};

export type ClinicalFile = {
  id: string;
  name: string;
  type: string;
  date: string;
  status: 'uploaded' | 'error';
};

export type Files = {
  items: ClinicalFile[];
};

export type HistoryEntry = {
  id: string;
  action: string;
  timestamp: string;
  author: string;
};

export type History = {
  entries: HistoryEntry[];
};

export type ClinicalRecordSectionData = {
  attention: CurrentAttention;
  antecedentes: Antecedents;
  preparacion: Preparation;
  evolucion: Evolution;
  odontograma: Odontogram;
  diagnosticos: Diagnoses;
  archivos: Files;
  historial: History;
};

export type ClinicalRecordSectionKey = keyof ClinicalRecordSectionData;

export type ClinicalRecordSectionState<Key extends ClinicalRecordSectionKey> = {
  data: ClinicalRecordSectionData[Key];
  validation: ClinicalRecordValidation;
  feedback: ClinicalRecordFeedback | null;
};

export type ClinicalRecordSections = {
  [Key in ClinicalRecordSectionKey]: ClinicalRecordSectionState<Key>;
};