export type FinalizeProcedureMaterialDto = {
  name: string;
  quantity: number;
  unit: string;
  notes: string;
};

export type FinalizeProcedureDto = {
  patientId: string;
  treatmentPlanId: string;
  procedureRecordId: string;
  description: string;
  amount: number;
  materials: FinalizeProcedureMaterialDto[];
};
