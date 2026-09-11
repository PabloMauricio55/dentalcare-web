export type TreatmentPlanStatus = "Borrador" | "Aprobado";

export type TreatmentProcedure = {
  id: string;
  name: string;
  tooth: string;
  quantity: number;
  unitPrice: number;
};

export type TreatmentPlan = {
  id: string;
  patientId: string;
  name: string;
  observations: string;
  date: string;
  professional: string;
  status: TreatmentPlanStatus;
  procedures: TreatmentProcedure[];
};

export type TreatmentBudgetStatus = "Borrador" | "Aprobado";

export type TreatmentBudget = {
  id: string;
  patientId: string;
  treatmentPlanId: string;
  status: TreatmentBudgetStatus;
  createdAt: string;
  approvedAt?: string;
};

export type TreatmentConsentStatus = "Pendiente" | "Aceptado";

export type TreatmentConsent = {
  id: string;
  patientId: string;
  treatmentPlanId: string;
  status: TreatmentConsentStatus;
  createdAt: string;
  acceptedAt?: string;
};

export type TreatmentProcedureRecordStatus = "Registrado" | "Finalizado";

export type TreatmentProcedureRecord = {
  id: string;
  patientId: string;
  treatmentPlanId: string;
  procedureId: string;
  procedureName: string;
  tooth: string;
  professional: string;
  date: string;
  time: string;
  notes: string;
  status: TreatmentProcedureRecordStatus;
};

export type ProcedureMaterial = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  notes: string;
};

export type ProcedureCompletion = {
  id: string;
  patientId: string;
  treatmentPlanId: string;
  procedureRecordId: string;
  materials: ProcedureMaterial[];
  completedAt: string;
};

export type TreatmentCharge = {
  id: string;
  patientId: string;
  treatmentPlanId: string;
  procedureRecordId: string;
  description: string;
  amount: number;
  status: "Generado";
  createdAt: string;
};

export type PrescriptionMedication = {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  duration: string;
  notes: string;
};

export type PatientInstructions = {
  generalCare: string;
  recommendations: string;
  restrictions: string;
  nextControl: string;
  observations: string;
};

export type TreatmentPrescription = {
  id: string;
  patientId: string;
  treatmentPlanId: string;
  procedureRecordId: string;
  professional: string;
  date: string;
  instructions: PatientInstructions;
  medications: PrescriptionMedication[];
  status: "Registrada";
};
