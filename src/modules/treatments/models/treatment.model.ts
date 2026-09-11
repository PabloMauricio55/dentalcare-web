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

export type TreatmentProcedureRecordStatus = "Registrado";

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
