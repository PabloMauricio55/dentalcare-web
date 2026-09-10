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
