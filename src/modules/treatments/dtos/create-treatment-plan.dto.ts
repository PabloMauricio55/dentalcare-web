export type CreateTreatmentProcedureDto = {
  name: string;
  tooth: string;
  quantity: number;
  unitPrice: number;
};

export type CreateTreatmentPlanDto = {
  patientId: string;
  name: string;
  observations: string;
  professional: string;
  procedures: CreateTreatmentProcedureDto[];
};
